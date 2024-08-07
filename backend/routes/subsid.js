require('dotenv').config();
const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const auth = require('../middleware/auth');
const {Suprsend,WorkflowTriggerRequest} = require("@suprsend/node-sdk");


const supr_client = new Suprsend(process.env.WorkspaceKey, process.env.WorkspaceSecret);

function hmac_rawurlsafe_base64_string(distinct_id, secret) {
    const hash = crypto
        .createHmac("sha256", secret)
        .update(distinct_id)
        .digest("base64url");
    return hash.trimEnd("=");
}

router.post('/subsId_generate', (req, res) => {
    const { distinct_id } = req.body;
    const secret = process.env.INBOXSECRET;
    console.log(distinct_id);
    if (!secret) {
        return res.status(400).send('Input is required');
    }
    try{
      const subsId = hmac_rawurlsafe_base64_string(distinct_id, secret);  
      res.status(200).send(subsId);
    }
    catch(err){
        res.status(500).send('Error generating subsId. Please try again.');
    }
}
);

router.post('/trigger', auth ,async (req, res) => {
    const {taskname} = req.body;
    const username = req.user.username;
    const workflow_payload = {
        "workflow": process.env.WorkspaceSLUG,
        "recipients": [
          {
            "distinct_id": username,
          }
        ],
        "data":{
          "TaskName":taskname
        }
    }
    const wf = new WorkflowTriggerRequest(workflow_payload)

    try {
      const response = await supr_client.workflows.trigger(wf);
      res.status(202).json({ status: 'success', data: response });
  } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to trigger workflow' });
  }
});


module.exports = router;