# n8n_repository

n8n is a workflow automation platform that connects apps and services to automate tasks with little or no code.

This repository contains n8n workflows, configuration, and related resources for workflow automation.

## Fibonacci utility

`fibonacci.py` provides a `fibonacci(n)` function that returns the first `n` members of the Fibonacci sequence, starting with `0` and `1`.

### Usage

Import the function from Python and provide a non-negative integer representing the number of members to return:

```python
from fibonacci import fibonacci

print(fibonacci(0))  # []
print(fibonacci(1))  # [0]
print(fibonacci(7))  # [0, 1, 1, 2, 3, 5, 8]
```

The function raises `TypeError` when the argument is not an integer and `ValueError` when the argument is negative. Boolean values are not accepted as integers.
