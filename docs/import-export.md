# Import / Export

## Export Format

```json
{
  "mode": "encrypted",
  "notes": {
    "id": "notes",
    "ciphertext": "encrypted notes in base64",
    "iv": "initialization vector in base64"
  },
  "folders": {
    "id": "folders",
    "ciphertext": "encrypted folders in base64",
    "iv": "initialization vector in base64",
  },
  "salt": "salt in base64",
  "secretKeyDigest": "secret key digest in base64"
}
```

- Folders and notes are encrypted.
- Export file includes encryption metadata.
