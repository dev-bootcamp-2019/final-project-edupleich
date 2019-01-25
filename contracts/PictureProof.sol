pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

/**  @title PictureProof: Proof of Existence for pictures */
contract PictureProof is Pausable {
    /**  @dev Registers a picture uploaded by the user */
    
    /*  state varaibles */
    address contractOwner;
    /*  struct that represent pictures uploaded byt the user */
    struct Picture {
        bytes32 pictureHash; //hash of picture
        address owner; //address of registration owner
        uint timestamp; //when the picture was registered
    }

    /*  The main storage array that contains structs that stores 
        all information for the Picture registrations */
    Picture[] public registry;

    // mapping(uint => Picture[]) public registry_of_pictures;
    /*________________________________________________________________________________________________*/

    /* Events */
    event Registration(address addr, uint index, bytes32 hash); /* when a new Picture is registered */
    event Removal(address remover, uint index); /* when a Picture registration is removed */
    event Transfer(address oldOwner, address newOwner, uint newIndex); /*  when a Picture registration is transferred to a new owner address */
    /*________________________________________________________________________________________________*/

    /* Modifiers */
    /*  verifies the validity of an index input and checks that a picture exists */
    modifier exists(uint index) {
        require(index >= 0);
        require(index < registry.length);
        require(registry[index].pictureHash != 0);
        _;
    }

    /*  confirms ownership */
    modifier isOwner(address _owner, uint index) {
        require(registry[index].owner == _owner);
        _;
    }

    /*  validates picture hash */
    modifier isPictureValidated(string memory pictureHash) {
        require(bytes(pictureHash).length <= 64); //length of sha256 hash
        require(bytes(pictureHash).length > 0);
        _;
    }
    /*________________________________________________________________________________________________*/


    constructor() public {
       contractOwner = msg.sender;
    }
    /*  default fallback, returns eth */
    function() external {
        revert();
    }

    /**  An external method that allows the user to create a new Picture registration
        from a string containing the Picture data. The string is typically a Sha3 hex hash of the
        actual Picture, but can be any information really. Will generate a Registration event upon
        completion. Method only available if contract is not paused.
        @param pictureData The data of the Picture. Typically a hex hash of the actual Picture
    */
    function register(string calldata pictureData)
        external
        isPictureValidated(pictureData)
        whenNotPaused
    {
        bytes32 pictureHash = digest(pictureData);

        (bool registered,) = isRegistered(pictureHash);
        require(!registered);

        registry.push(Picture(pictureHash, msg.sender, now));

        emit Registration(msg.sender, registry.length - 1, pictureHash);
    }

    /**  An external view method that checks whether a Picture registration for
        given Picture data exists. Returns true and the index of the registration if a
        Picture registration exists, otherwise returns false and null. The method is
        available even if the contract is paused, since no state changes are created.
        @param pictureData The data of the Picture. Typically a hex hash of the actual Picture
    */
    function checkRegistration(string calldata pictureData)
        external
        view
        isPictureValidated(pictureData)
        returns (bool, uint)
    {
        return isRegistered(digest(pictureData));
    }

    /** An external method with which a Picture registration can be removed. Only the owner of
        the registration can remove the registration. Will generate a Removal event upon completion.
        The method is not available when the contract is paused since it changes the state.
        @param index The index of the Picture registration to be removed
    */
    function remove(uint index)
        external
        exists(index)
        isOwner(msg.sender, index)
        whenNotPaused
    {
        delete registry[index];

        emit Removal(msg.sender, index);
    }

    /** An external method that transfers the ownership over a Picture registration to a new
        owner address. Checks that the new owner address is not the null address to prevent
        an Picture registration from becoming unavailable. The method is not available when the
        contract is paused since it changes the state. Generates a Transfer event upon completion.
        @param index The index of the Picture registration to be transferred in the registry array.
        @param newOwner The address to which the registration ownership shall be transferred
    */
    function transfer(uint index, address newOwner)
        external
        exists(index)
        isOwner(msg.sender, index)
        whenNotPaused
    {
        require(newOwner != address(0));

        registry[index].owner = newOwner;

        emit Transfer(msg.sender, newOwner, index);
    }

    /** An external view method that simply returns the length of the registry array. This
        function is necessary for the UI to iterate through every registration in the registry array
    */
    function getRegistrationCount(address _owner)
        external
        view
        returns (uint)
    {
        uint count = 0;
        for (uint idx=0; idx < registry.length; idx++){
            if (registry[idx].owner == _owner){
                count++;
            }
        }
        return count;
    }

    /** An internal view method that checks whether a registration for a given keccak256 hash exists.
        Returns true and the index of the registration in the registry array if a Picture registration
        exists. Otherwise returns false and null. The method iterates through the whole registry
        array and checks whether any registration contains the given keccak256 hash.
        @param pictureHash A keccak256 hash, whose existence of registration is to be checked
    */
    function isRegistered(bytes32 pictureHash)
        internal
        view
        returns (bool, uint)
    {
        for (uint idx = 0; idx < registry.length; idx++) {
            if (registry[idx].pictureHash == pictureHash) {
                return (true, idx);
            }
        }

        return (false, 0);
    }

    /** A pure internal method that converts a given string input to bytes and creates the
        keccak256 hash of those bytes. The method returns the computed keccak256 hash of the bytes
    */
    function digest(string memory input)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(bytes(input));
    }

      /* We have these functions completed so we can run tests, just ignore it :) */
    function fetchPicture(uint _id)
        public
        view
        returns (
            bytes32 pictureHash,
            address owner,
            uint timestamp
        ) {
        pictureHash = registry[_id].pictureHash;
        owner = registry[_id].owner;
        timestamp = registry[_id].timestamp;
        
        return (pictureHash, owner, timestamp);
  }
}