
pragma solidity ^0.4.19;

pragma experimental ABIEncoderV2;

contract Registry  {
    struct Detail {

        string patientName;
        string dateOfRegistry;
        uint32 mobileNumber;
        string city;
        uint32 quantity;
    }


    function strConcat(string _a, string _b) internal returns (string){
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    string memory abcde = new string(_ba.length + _bb.length);
    bytes memory babcde = bytes(abcde);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
    for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
    return string(babcde);
}




        mapping(uint64 => Detail[]) registryList;
    
    function newRegistry(uint64 hash, uint32 mobileNumber, string patientName, string dateOfRegistry,string city,uint32 quantity) public {
       registryList[hash].push(Detail(patientName,dateOfRegistry,mobileNumber,city,quantity));
    }

    function updateRegistry(uint64 hash, uint32 mobileNumber, string patientName, string dateOfRegistry,string city,uint32 quantity) public {
       registryList[hash].push(Detail(patientName,dateOfRegistry,mobileNumber,city,quantity));
    }


    function getRegistry(uint64 hash) view public returns ( string , uint32 [],string , uint32[] ) {


        uint256 len = registryList[hash].length;
        
        uint32 [] memory number = new uint32[](len);
            string  memory date="";

        uint32 [] memory quantity = new uint32[](len);
            string memory city="";
            if(len == 0)
                 return(date,number,city,quantity);
            for(uint i = 0;i<len;i++)
            {
                date = strConcat(date,strConcat(registryList[hash][i].dateOfRegistry,"$"));
                number[i] = registryList[hash][i].mobileNumber;
                city = strConcat(city,strConcat(registryList[hash][i].city,"$"));
                quantity[i] = registryList[hash][i].quantity;
            }
           
        
        return (date , number,city,quantity);
    }
   
}
