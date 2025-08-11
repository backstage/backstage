# Testing GoogleServiceAccountStrategy with GKE

This guide will help you set up a GKE cluster and service account to test the `GoogleServiceAccountStrategy`.

## Prerequisites

1. Install the Google Cloud CLI (`gcloud`)
2. A Google Cloud Project with billing enabled
3. Enable required APIs

## Step 1: Enable Required APIs

```bash
# Enable the required Google Cloud APIs
gcloud services enable container.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable iam.googleapis.com
```

## Step 2: Create a GKE Cluster

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
export CLUSTER_NAME="backstage-test-cluster"
export REGION="us-central1"

# Create a GKE cluster
gcloud container clusters create $CLUSTER_NAME \
    --region=$REGION \
    --project=$PROJECT_ID \
    --num-nodes=1 \
    --machine-type=e2-medium \
    --disk-size=20GB \
    --enable-autorepair \
    --enable-autoupgrade \
    --workload-pool=$PROJECT_ID.svc.id.goog
```

## Step 3: Create a Service Account for Backstage

```bash
# Create a service account for Backstage
export SERVICE_ACCOUNT_NAME="backstage-k8s-reader"
export SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"

gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
    --display-name="Backstage Kubernetes Reader" \
    --description="Service account for Backstage to access Kubernetes clusters"
```

## Step 4: Grant Required Permissions

```bash
# Grant Container Engine Viewer role (to list and view clusters)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/container.clusterViewer"

# Grant Kubernetes Engine Viewer role (to view cluster resources)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/container.viewer"

# Optional: Grant more specific permissions if needed
# For reading pods, services, etc.
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/container.developer"
```

## Step 5: Create and Download Service Account Key

```bash
# Create a service account key
gcloud iam service-accounts keys create backstage-sa-key.json \
    --iam-account=$SERVICE_ACCOUNT_EMAIL

# Display the key content (you'll need this for your Backstage config)
cat backstage-sa-key.json
```

## Step 6: Configure Backstage

Add the following to your `app-config.yaml`:

```yaml
kubernetes:
  # Your service account credentials as a JSON string
  googleServiceAccountCredentials: |
    {
      "type": "service_account",
      "project_id": "your-project-id",
      "private_key_id": "...",
      "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
      "client_email": "backstage-k8s-reader@your-project-id.iam.gserviceaccount.com",
      "client_id": "...",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
    }

  clusterLocatorMethods:
    - type: 'gke'
      projectId: 'your-project-id'
      region: 'us-central1'
      authProvider: 'googleServiceAccount'
```

## Step 7: Test the Connection

### Option 1: Using gcloud to verify cluster access

```bash
# Get cluster credentials
gcloud container clusters get-credentials $CLUSTER_NAME \
    --region=$REGION \
    --project=$PROJECT_ID

# Test kubectl access
kubectl get nodes
kubectl get pods --all-namespaces
```

### Option 2: Test with the service account directly

```bash
# Activate the service account
gcloud auth activate-service-account $SERVICE_ACCOUNT_EMAIL \
    --key-file=backstage-sa-key.json

# Get cluster credentials using the service account
gcloud container clusters get-credentials $CLUSTER_NAME \
    --region=$REGION \
    --project=$PROJECT_ID

# Test access
kubectl get nodes
```

## Step 8: Deploy Test Workloads (Optional)

```bash
# Create a test namespace
kubectl create namespace backstage-test

# Deploy a simple nginx pod
kubectl create deployment nginx --image=nginx -n backstage-test

# Create a service
kubectl expose deployment nginx --port=80 --type=ClusterIP -n backstage-test

# Verify resources
kubectl get all -n backstage-test
```

## Step 9: Verify in Backstage

1. Start your Backstage application
2. Navigate to the Kubernetes plugin
3. You should see your GKE cluster and its resources
4. Check the browser console and backend logs for any authentication errors

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**

   - Verify the service account has the correct IAM roles
   - Check that the Kubernetes RBAC permissions are set correctly

2. **Authentication Errors**

   - Ensure the service account key JSON is valid
   - Verify the `googleServiceAccountCredentials` config is properly formatted

3. **Cluster Not Found**

   - Check that the `projectId` and `region` match your actual cluster
   - Verify the cluster exists: `gcloud container clusters list`

4. **API Not Enabled**
   - Ensure all required APIs are enabled in your project

### Useful Commands

```bash
# List all clusters
gcloud container clusters list

# Get cluster info
gcloud container clusters describe $CLUSTER_NAME --region=$REGION

# List service accounts
gcloud iam service-accounts list

# Check IAM policies
gcloud projects get-iam-policy $PROJECT_ID

# Test authentication with service account
gcloud auth list
```

## Cleanup

When you're done testing:

```bash
# Delete the cluster
gcloud container clusters delete $CLUSTER_NAME --region=$REGION

# Delete the service account
gcloud iam service-accounts delete $SERVICE_ACCOUNT_EMAIL

# Remove the key file
rm backstage-sa-key.json
```

## Security Best Practices

1. **Never commit service account keys to version control**
2. **Use environment variables or secret management systems in production**
3. **Regularly rotate service account keys**
4. **Apply principle of least privilege - only grant necessary permissions**
5. **Monitor service account usage in Cloud Logging**

## Alternative: Using Workload Identity (Recommended for Production)

Instead of service account keys, consider using Workload Identity for production deployments:

```bash
# Enable Workload Identity on the cluster
gcloud container clusters update $CLUSTER_NAME \
    --region=$REGION \
    --workload-pool=$PROJECT_ID.svc.id.goog

# Create a Kubernetes service account
kubectl create serviceaccount backstage-ksa

# Bind the Kubernetes service account to the Google service account
gcloud iam service-accounts add-iam-policy-binding $SERVICE_ACCOUNT_EMAIL \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:$PROJECT_ID.svc.id.goog[default/backstage-ksa]"

# Annotate the Kubernetes service account
kubectl annotate serviceaccount backstage-ksa \
    iam.gke.io/gcp-service-account=$SERVICE_ACCOUNT_EMAIL
```

This approach eliminates the need for service account keys and is more secure for production use.
