# Design Pattern Decisions


### Circuit Breaker
Using zeppelin's Pausable, the owner of the contract can pause but not destroy
 
 ### Fallback
 Revert() was used in order to send ether back in case of an error.
 
 
### Restricting Access
The `isOwner` modifier restricts the access to Picture methodsso that only the owner can update their Pictures.


