#!/bin/bash
zip -r myproject.zip . -x "*.git*" "node_modules/*" "__pycache__/*"