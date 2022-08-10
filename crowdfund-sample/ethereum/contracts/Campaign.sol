// SPDX-License-Identifier: MIT

pragma solidity ^0.8;

contract CampaignFactory {
    Campaign[] public campaigns;

    function createCampaign(uint minimumContribution) external {
        campaigns.push(new Campaign(minimumContribution, msg.sender));
    }

    function getCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }
}

contract Campaign {
    struct Request {
        address recipient;
        uint value;
        string description;
        mapping(address => bool) voted;
        uint votes;
        bool complete;
    }

    address public manager;
    uint public minimumContribution;

    Request[] public requests;
    mapping(address => bool) public contributor;
    uint public contributions;

    modifier onlyManager() {
        require(msg.sender == manager, "You are not a manager");
        _;
    }

    constructor(uint _minimumContribution, address _manager) {
        manager = _manager;
        minimumContribution = _minimumContribution;
    }

    function contribute() external payable {
        require(
            msg.value >= minimumContribution,
            "Minimum contribution value not met"
        );
        if (!contributor[msg.sender]) {
            contributor[msg.sender] = true;
            contributions++;
        }
    }

    function createRequest(
        address recipient,
        uint value,
        string calldata description
    ) external onlyManager {
        Request storage r = requests.push();
        r.recipient = recipient;
        r.value = value;
        r.description = description;
        r.votes = 0;
        r.complete = false;
    }

    function approveRequest(uint requestID) external {
        require(
            contributor[msg.sender],
            "Only contributors are allowed to approve requests"
        );
        Request storage r = requests[requestID];
        require(!r.voted[msg.sender], "You have already approved this request");
        r.voted[msg.sender] = true;
        r.votes++;
    }

    function finalizeRequest(uint requestID) external onlyManager {
        Request storage r = requests[requestID];
        require(
            r.votes > (contributions / 2),
            "Not enough approvals to execute request"
        );
        require(!r.complete, "Request is already completed");
        r.complete = true;
        payable(r.recipient).transfer(r.value);
    }

    function getSummary() external view
        returns (uint, uint, uint, uint, address)
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            contributions,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}
