FROM python:3.11-slim

WORKDIR /app

# Install deps first (layer cached unless requirements change)
COPY requirements_ui.txt .
RUN pip install --no-cache-dir -r requirements_ui.txt

# Copy models and API
COPY models/ ./models/
COPY api.py .

EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
