from fastapi import HTTPException, status
from app.main import app
from app.core import security
from app.api import dependencies


METRICS = {
    "cpu_p": [[1653922800000, 1], [1653922801000, 3], [1653922802000, 5]],
    "vm_p": [[1653922800000, 11], [1653922801000, 13], [1653922802000, 10]],
}


async def get_metrics_service_mock():
    class Srv:
        async def get_metrics(self, metric, count=100):
            if not metric in METRICS:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Incorrect metric name: {metric}",
                )

            return METRICS[metric]

    return Srv()


async def test_metrics_cpu(client, superuser_token_headers):
    app.dependency_overrides[dependencies.common.get_metrics_service] = get_metrics_service_mock

    response = await client.get("/api/system/metrics/cpu_p", headers=superuser_token_headers)

    assert response.status_code == 200
    assert response.json() == METRICS["cpu_p"]


async def test_metrics_vm(client, superuser_token_headers):
    app.dependency_overrides[dependencies.common.get_metrics_service] = get_metrics_service_mock

    response = await client.get("/api/system/metrics/vm_p", headers=superuser_token_headers)

    assert response.status_code == 200
    assert response.json() == METRICS["vm_p"]


async def test_metrics_invalid(client, superuser_token_headers):
    app.dependency_overrides[dependencies.common.get_metrics_service] = get_metrics_service_mock

    response = await client.get("/api/system/metrics/invalid", headers=superuser_token_headers)

    assert response.status_code == 404
    assert response.json() == {"detail": "Incorrect metric name: invalid"}


async def test_modules_json(client, superuser_token_headers):
    response = await client.get("/api/system/modules")
    response_fast = await client.get("/api/system/modules_fast")

    assert response.status_code == 200
    assert response_fast.status_code == 200

    assert response.json() == response_fast.json()
