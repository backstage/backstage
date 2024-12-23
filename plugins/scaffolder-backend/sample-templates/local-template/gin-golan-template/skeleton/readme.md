# ${{values.component_id}}

${{values.description}}

## Requirements

- go${{values.go_version}}

## Run

```
go mod tidy
go run .
```

## Access

http://localhost:${{values.port}}/