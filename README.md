# n8n_repository

n8n is a workflow automation platform that connects apps and services to automate tasks with little or no code.

This repository contains n8n workflows, configuration, and related resources for workflow automation.

## Fibonacci utility

`fibonacci.py` provides a `fibonacci(n)` function that returns the Fibonacci number at zero-based index `n`:

- `F(0) = 0`
- `F(1) = 1`
- `F(n) = F(n - 1) + F(n - 2)` for `n > 1`

### Usage

Import the function from Python and provide a non-negative integer:

```python
from fibonacci import fibonacci

print(fibonacci(0))  # 0
print(fibonacci(1))  # 1
print(fibonacci(10)) # 55
```

The function raises `TypeError` when the argument is not an integer and `ValueError` when the argument is negative. Boolean values are not accepted as integer indexes.
