# Kubernetes delivery layout

Manifests live in git as the source of truth; the cluster (named `borg`) is
deployed entirely from OCI artifacts pushed to GHCR.

```
kubernetes/
  environments/
    dev/            namespace + OCIRepository(chart) + HelmRelease + sealed-secret template
    production/     same shape, production values
  clusters/
    borg/           one-time bootstrap: Flux Kustomization + OCIRepository
                    pointing at the kustomization artifacts
```

## Flow

1. `release.yaml` pushes `kubernetes/environments/{dev,production}` as OCI
   artifacts: `ghcr.io/<owner>/payload-cms/kustomization/{dev,production}:0.1.N`.
2. The bootstrap Kustomizations in `clusters/borg/` (applied once) pull those
   artifacts and kustomize-controller applies the environment manifests.
3. Each environment's `OCIRepository` fetches the Helm chart from
   `ghcr.io/<owner>/payload-cms/chart` (semver ref) and `helm-controller`
   renders it with the inline `values` in the `HelmRelease`.
4. The Deployment references the app image
   (`ghcr.io/<owner>/payload-cms/site/{dev,production}`), which kubelet pulls.

## Bootstrap (one-time)

```bash
flux bootstrap github --owner=<owner> --repository=payload-cms --branch=production
kubectl apply -k kubernetes/clusters/borg
```

## Sealed secrets

Controller: `kube-system`, cert at
`https://sealed-secrets.borg.external.systems/cert/v1` (pending deployment).
Generate sealed secrets per environment by following the instructions in
`environments/*/sealed-secret.yaml.example`, then add the generated file to
that environment's `kustomization.yaml`.
