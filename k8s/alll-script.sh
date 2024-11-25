kubectl apply -f ./k8s/back-end.config-map.yml

kubectl apply -f ./k8s/back-end.deployment.yml
kubectl apply -f ./k8s/user-service.deployment.yml

kubectl apply -f ./k8s/back-end.service.yml
kubectl apply -f ./k8s/user-service.service.yml

kubectl port-forward deployment/back-end 3000:3000