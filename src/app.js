import React, {Component} from 'react';
import styled from "styled-components";
import GitFlow from "./gitflow";
import shortid from "shortid";
import branch_names from './config';

const DEVELOP = branch_names.DEVEL;
const MASTER = branch_names.RELEASE;

const releaseID = shortid.generate();
const developID = shortid.generate();
const rcID = shortid.generate();

const seedData = () => {

    const commits = [
        {
            id: shortid.generate(),
            branch: releaseID,
            gridIndex: 1,
            parents: null,
        },
        {
            id: shortid.generate(),
            branch: developID,
            gridIndex: 1,
            parents: null
        }
    ];
    return {
        branches: [
            {
                name: MASTER,
                id: releaseID,
                canCommit: false,
                color: '#E040FB',
            },
            {
                name: DEVELOP,
                id: developID,
                canCommit: true,
                color: '#FF8A65',
            }
        ],
        commits
    }
};

const AppElm = styled.main`
  text-align: center;
  padding: 10px;
`;

class App extends Component {

    state = {
        project: seedData()
    };

    handleCommit = (branchID, mergeGridIndex = 0) => {
        let {commits} = this.state.project;
        const branchCommits = commits.filter(c => c.branch === branchID);
        const lastCommit = branchCommits[branchCommits.length - 1];
        commits.push({
            id: shortid.generate(),
            branch: branchID,
            gridIndex: lastCommit.gridIndex + mergeGridIndex + 1,
            parents: [lastCommit.id]
        });
        this.setState({
            commits
        });
    };

    handleNewFeature = () => {
        let {branches, commits} = this.state.project;
        let featureBranches = branches.filter(b => b.featureBranch);
        let featureBranchName = branch_names.FEATURE + ((featureBranches || []).length + 1);
        let developCommits = commits.filter(c => c.branch === developID);
        const lastDevelopCommit = developCommits[developCommits.length - 1];
        let featureOffset = lastDevelopCommit.gridIndex + 1;
        let newBranch = {
            id: shortid.generate(),
            name: featureBranchName,
            featureBranch: true,
            canCommit: true,
            color: '#64B5F6'
        };
        let newCommit = {
            id: shortid.generate(),
            branch: newBranch.id,
            gridIndex: featureOffset,
            parents: [lastDevelopCommit.id]
        };
        commits.push(newCommit);
        branches.push(newBranch);
        this.setState({
            project: {
                branches,
                commits
            }
        });
    };

    handleNewQAFix = () => {
        let {branches, commits} = this.state.project;
        let rcBranches = branches.filter(b => b.rcBranch);
        let newBranchName = branch_names.QAFIX + ((rcBranches || []).length + 1);
        let lastCommits = commits.filter(c => c.branch === rcID);
        const lastCommit = lastCommits[lastCommits.length - 1];
        let commitOffset = lastCommit.gridIndex + 1;
        let newBranch = {
            id: shortid.generate(),
            name: newBranchName,
            qaFixBranch: true,
            canCommit: true,
            color: '#64B5F6'
        };
        let newCommit = {
            id: shortid.generate(),
            branch: newBranch.id,
            gridIndex: commitOffset,
            parents: [lastCommit.id]
        };
        commits.push(newCommit);
        branches.push(newBranch);
        this.setState({
            project: {
                branches,
                commits
            }
        });
    };


    handleNewHotFix = () => {
        let {branches, commits} = this.state.project;
        let hotFixBranches = branches.filter(b => b.hotFixBranch);
        let hotFixBranchName = branch_names.HOTFIX + ((hotFixBranches || []).length + 1);
        let releaseCommits = commits.filter(c => c.branch === releaseID);
        const lastReleaseCommit = releaseCommits[releaseCommits.length - 1];
        let hotFixOffset = lastReleaseCommit.gridIndex + 1;

        let newBranch = {
            id: shortid.generate(),
            name: hotFixBranchName,
            hotFixBranch: true,
            canCommit: true,
            color: '#ff1744'
        };
        let newCommit = {
            id: shortid.generate(),
            branch: newBranch.id,
            gridIndex: hotFixOffset,
            parents: [lastReleaseCommit.id]
        };
        commits.push(newCommit);
        branches.push(newBranch);
        this.setState({
            project: {
                branches,
                commits
            }
        });
    };

    handleNewRC = () => {
        let {branches, commits} = this.state.project;
        let rcBranches = branches.filter(b => b.rcBranch);
        let rcBranchName = branch_names.RC + ((rcBranches || []).length + 1);
        let developCommits = commits.filter(c => c.branch === developID);
        const lastDevelopCommit = developCommits[developCommits.length - 1];
        let rcOffset = lastDevelopCommit.gridIndex + 1;
        let newBranch = {
            id: rcID,
            name: rcBranchName,
            rcBranch: true,
            canCommit: true,
            color: '#B2FF59'
        };
        let newCommit = {
            id: shortid.generate(),
            branch: newBranch.id,
            gridIndex: rcOffset,
            parents: [lastDevelopCommit.id]
        };
        commits.push(newCommit);
        branches.push(newBranch);
        this.setState({
            project: {
                branches,
                commits
            }
        });
    };

    handleRCMerge = (sourceBranchID) => {
        let {branches, commits} = this.state.project;
        const sourceBranch = branches.find(b => b.id === sourceBranchID);
        const sourceCommits = commits.filter(c => c.branch === sourceBranchID);

        const releaseCommits = commits.filter(c => c.branch === releaseID);
        const developCommits = commits.filter(c => c.branch === developID);
        const lastSourceCommit = sourceCommits[sourceCommits.length - 1];
        const lastReleaseCommit = releaseCommits[releaseCommits.length - 1];
        const lastDevelopCommit = developCommits[developCommits.length - 1];

        const releaseMergeCommit = {
            id: shortid.generate(),
            branch: releaseID,
            gridIndex: Math.max(lastSourceCommit.gridIndex, lastReleaseCommit.gridIndex) + 1,
            parents: [lastReleaseCommit.id, lastSourceCommit.id]
        };

        const developMergeCommit = {
            id: shortid.generate(),
            branch: developID,
            gridIndex: Math.max(lastSourceCommit.gridIndex, lastDevelopCommit.gridIndex) + 1,
            parents: [lastDevelopCommit.id, lastSourceCommit.id]
        };

        commits.push(releaseMergeCommit, developMergeCommit);
        sourceBranch.merged = true;

        this.setState({
            project: {
                branches,
                commits
            }
        });

    };

    handleQAFixMerge = (sourceBranchID) => {
        let {branches, commits} = this.state.project;
        const sourceBranch = branches.find(b => b.id === sourceBranchID);
        const sourceCommits = commits.filter(c => c.branch === sourceBranchID);

        const releaseCommits = commits.filter(c => c.branch === releaseID);
        const developCommits = commits.filter(c => c.branch === rcID);
        const lastSourceCommit = sourceCommits[sourceCommits.length - 1];
        const lastReleaseCommit = releaseCommits[releaseCommits.length - 1];
        const lastDevelopCommit = developCommits[developCommits.length - 1];

        const releaseMergeCommit = {
            id: shortid.generate(),
            branch: releaseID,
            gridIndex: Math.max(lastSourceCommit.gridIndex, lastReleaseCommit.gridIndex) + 1,
            parents: [lastReleaseCommit.id, lastSourceCommit.id]
        };

        const rcMergeCommit = {
            id: shortid.generate(),
            branch: rcID,
            gridIndex: Math.max(lastSourceCommit.gridIndex, lastDevelopCommit.gridIndex) + 1,
            parents: [lastDevelopCommit.id, lastSourceCommit.id]
        };

        commits.push(rcMergeCommit);
        sourceBranch.merged = true;

        this.setState({
            project: {
                branches,
                commits
            }
        });

    };


    handleMerge = (sourceBranchID, targetBranchID = developID) => {
        let {branches, commits} = this.state.project;

        const sourceBranch = branches.find(b => b.id === sourceBranchID);
        const sourceCommits = commits.filter(c => c.branch === sourceBranchID);
        const targetCommits = commits.filter(c => c.branch === targetBranchID);

        const lastSourceCommit = sourceCommits[sourceCommits.length - 1];
        const lastTargetCommit = targetCommits[targetCommits.length - 1];

        const mergeCommit = {
            id: shortid.generate(),
            branch: targetBranchID,
            gridIndex: Math.max(lastSourceCommit.gridIndex, lastTargetCommit.gridIndex) + 1,
            parents: [lastSourceCommit.id, lastTargetCommit.id]
        };
        commits.push(mergeCommit);

        sourceBranch.merged = true;

        this.setState({
            project: {
                branches,
                commits
            }
        });
    };

    handleDeleteBranch = (branchID) => {
        let {branches, commits} = this.state.project;

        let commitsToDelete = commits.filter(c => c.branch === branchID);
        let lastCommit = commitsToDelete[commitsToDelete.length - 1];
        commits = commits.map(commit => {
            if (commit.parents) {
                commit.parents = commit.parents.filter(pID => pID !== lastCommit.id);
            }
            return commit;

        });
        branches = branches.filter(b => b.id !== branchID);
        commits = commits.filter(c => c.branch !== branchID);
        this.setState({
            project: {
                branches,
                commits
            }
        });
    };

    render() {
        return (
            <AppElm>
                <GitFlow
                    project={this.state.project}
                    onMerge={this.handleMerge}
                    onRCMerge={this.handleRCMerge}
                    onCommit={this.handleCommit}
                    onNewFeature={this.handleNewFeature}
                    onNewRC={this.handleNewRC}
                    onNewQAFix={this.handleNewQAFix}
                    onQAFixMerge={this.handleQAFixMerge}
                    onDeleteBranch={this.handleDeleteBranch}
                    onNewHotFix={this.handleNewHotFix}
                />
            </AppElm>
        );
    }
}

export default App;
