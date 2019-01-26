# Avoiding Common Attacks

### Exposed Functions
All functions are either internal or external when applicable.


### Denial of Service
All input data is validates and loops were avoided in most functions.


### Gas Limits
State-changing functions were kept as succint as possible and used pure functions whenever possible, therefore the gas limit is always in check.
