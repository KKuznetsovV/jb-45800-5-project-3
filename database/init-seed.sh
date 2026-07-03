#!/bin/bash
# Runs once on first database initialisation (empty /data/db).
# MongoDB is already up at this point — connect via localhost.
echo "Seeding vacations database..."
node /seed/dist/seed.js
echo "Seeding complete."
