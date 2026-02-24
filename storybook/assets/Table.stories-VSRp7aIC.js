import{j as n}from"./iframe-BzU7-g6W.js";import{m as y}from"./makeStyles-S8VF_kfg.js";import{B as h}from"./Box-Buols8Z9.js";import{T as l}from"./Table-CFgaAbgf.js";import{L as C}from"./Link-CKRvx-Sg.js";import"./preload-helper-PPVm8Dsz.js";import"./styled-CKk5njoZ.js";import"./objectWithoutProperties-CMxqAbIg.js";import"./FilterList-DQhIyI0t.js";import"./Backdrop-Bu53pH1k.js";import"./Grid-B3qBpLSb.js";import"./useMediaQuery-CFwYGRum.js";import"./Select-C3BmRJP_.js";import"./index-B9sM2jn7.js";import"./Popover-DWFOE5cT.js";import"./Modal-CBIhH-ZN.js";import"./Portal-CgRRNkEQ.js";import"./List-_WnCGckP.js";import"./ListContext-BaISySc_.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CCSUUg6C.js";import"./Popper-DYEx6Kul.js";import"./RadioGroup-DMyNSJ9J.js";import"./SwitchBase-CkYcqQ1v.js";import"./Drawer-D3SufB8A.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./AccordionDetails-s3m5U6U0.js";import"./Collapse-ByHAuMFu.js";import"./Avatar-DQKrco8-.js";import"./Badge-DdB2iOAg.js";import"./BottomNavigationAction-CbrKpHpA.js";import"./Breadcrumbs-Cp1GSnHY.js";import"./Button-CrpaRf-H.js";import"./CardContent-sISFI28P.js";import"./CardActions-Dd00FLn4.js";import"./CardHeader-BJ2HNia4.js";import"./CardMedia-rXWw1e5_.js";import"./Checkbox-BOHm3DKz.js";import"./Chip-BZqhero0.js";import"./CircularProgress-BFfhfkuM.js";import"./CssBaseline-CATAMU6G.js";import"./DialogTitle-HMdj6FuL.js";import"./DialogContentText-DOksy6rF.js";import"./Divider-eSNn4IOg.js";import"./FormLabel-DnrPLeAV.js";import"./FormControlLabel-0Ebsdcvh.js";import"./TextField-DFnH9uN2.js";import"./InputLabel-BTZCDr4e.js";import"./InputAdornment-BNXtgqg7.js";import"./LinearProgress-Bwgh_mlC.js";import"./ListItem-Cdpwxzx8.js";import"./ListItemAvatar-D5RtWkmH.js";import"./ListItemIcon-YXzgYqAm.js";import"./Switch-CgT-7s5F.js";import"./ListItemText-joEMPdaR.js";import"./ListSubheader-Jjmo5ZJC.js";import"./MenuItem-C5wiJzzA.js";import"./Remove-Br0HSg7H.js";import"./StepLabel-Ct-1OPp8.js";import"./Tabs-CfX9Hd9d.js";import"./KeyboardArrowRight-D-flldRH.js";import"./TableRow-CoDIqsm6.js";import"./TableCell-hRAxeCNu.js";import"./TablePagination-D72pn9N2.js";import"./Tooltip-DkbrsvZ9.js";import"./objectSpread2-BAZRLg4V.js";import"./index-tkVjLpcC.js";import"./ChevronRight-DQuf_b2x.js";import"./Edit-DL61li4g.js";import"./Search-B40039-q.js";import"./lodash-CgiI-b7o.js";import"./Select-ChRB4Z1l.js";import"./Cancel-19tlhBgQ.js";import"./index-CgRTFS8p.js";import"./useAnalytics-CzoS-In4.js";import"./useApp-CYpMgEga.js";const T=y(t=>({value:{marginBottom:t.spacing(.75)},subvalue:{color:t.palette.textSubtle,fontWeight:"normal"}}),{name:"BackstageSubvalueCell"});function v(t){const{value:e,subvalue:a}=t,g=T();return n.jsxs(n.Fragment,{children:[n.jsx(h,{className:g.value,children:e}),n.jsx(h,{className:g.subvalue,children:a})]})}v.__docgenInfo={description:"",methods:[],displayName:"SubvalueCell",props:{value:{required:!0,tsType:{name:"ReactNode"},description:""},subvalue:{required:!0,tsType:{name:"ReactNode"},description:""}}};const Je={title:"Data Display/Table",component:l,tags:["!manifest"]},b=y(t=>({container:{width:850},empty:{padding:t.spacing(2),display:"flex",justifyContent:"center"}})),N=(t=10)=>{const e=[];for(;e.length<=t;)e.push({col1:`Some value ${e.length}`,col2:`More data ${e.length}`,subvalue:`Subvalue ${e.length}`,number:Math.round(Math.abs(Math.sin(e.length))*1e3),date:new Date(Math.abs(Math.sin(e.length))*1e13)});return e},f=N(10),s=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:f,columns:e,title:"Backstage Table"})})},o=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:[],columns:e,isLoading:!0,title:"Backstage Table"})})},i=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:[],columns:e,emptyContent:n.jsxs("div",{className:t.empty,children:["No data was added yet, ",n.jsx(C,{to:"http://backstage.io/",children:"learn how to add data"}),"."]}),title:"Backstage Table"})})},r=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:f,columns:e,title:"Backstage Table",subtitle:"Table Subtitle"})})},c=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1,search:!1},data:f,columns:e})})},u=()=>{const t=b(),e=[{title:"Column 1",customFilterAndSearch:(a,g)=>`${g.col1} ${g.subvalue}`.toLocaleUpperCase("en-US").includes(a.toLocaleUpperCase("en-US")),field:"col1",highlight:!0,render:a=>n.jsx(v,{value:a.col1,subvalue:a.subvalue})},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:f,columns:e})})},m=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1,padding:"dense"},data:f,columns:e,title:"Backstage Table"})})},d=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}],a=[{column:"Column 1",type:"select"},{column:"Column 2",type:"multiple-select"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1,padding:"dense"},data:f,columns:e,filters:a})})},p=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0,cellStyle:(a,g)=>g.tableData.id%2===0?{color:"#6CD75F"}:{color:"#DC3D5A"}},{title:"Column 2",field:"col2",cellStyle:{color:"#2FA5DC"}},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:f,columns:e,title:"Backstage Table"})})};s.__docgenInfo={description:"",methods:[],displayName:"DefaultTable"};o.__docgenInfo={description:"",methods:[],displayName:"LoadingTable"};i.__docgenInfo={description:"",methods:[],displayName:"EmptyTable"};r.__docgenInfo={description:"",methods:[],displayName:"SubtitleTable"};c.__docgenInfo={description:"",methods:[],displayName:"HiddenSearchTable"};u.__docgenInfo={description:"",methods:[],displayName:"SubvalueTable"};m.__docgenInfo={description:"",methods:[],displayName:"DenseTable"};d.__docgenInfo={description:"",methods:[],displayName:"FilterTable"};p.__docgenInfo={description:"",methods:[],displayName:"StyledTable"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const DefaultTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: "Column 1",
      field: "col1",
      highlight: true,
    },
    {
      title: "Column 2",
      field: "col2",
    },
    {
      title: "Numeric value",
      field: "number",
      type: "numeric",
    },
    {
      title: "A Date",
      field: "date",
      type: "date",
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false }}
        data={testData10}
        columns={columns}
        title="Backstage Table"
      />
    </div>
  );
};
`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const LoadingTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: "Column 1",
      field: "col1",
      highlight: true,
    },
    {
      title: "Column 2",
      field: "col2",
    },
    {
      title: "Numeric value",
      field: "number",
      type: "numeric",
    },
    {
      title: "A Date",
      field: "date",
      type: "date",
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false }}
        data={[]}
        columns={columns}
        isLoading
        title="Backstage Table"
      />
    </div>
  );
};
`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const EmptyTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: "Column 1",
      field: "col1",
      highlight: true,
    },
    {
      title: "Column 2",
      field: "col2",
    },
    {
      title: "Numeric value",
      field: "number",
      type: "numeric",
    },
    {
      title: "A Date",
      field: "date",
      type: "date",
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false }}
        data={[]}
        columns={columns}
        emptyContent={
          <div className={classes.empty}>
            No data was added yet,&nbsp;
            <Link to="http://backstage.io/">learn how to add data</Link>.
          </div>
        }
        title="Backstage Table"
      />
    </div>
  );
};
`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const SubtitleTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: "Column 1",
      field: "col1",
      highlight: true,
    },
    {
      title: "Column 2",
      field: "col2",
    },
    {
      title: "Numeric value",
      field: "number",
      type: "numeric",
    },
    {
      title: "A Date",
      field: "date",
      type: "date",
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false }}
        data={testData10}
        columns={columns}
        title="Backstage Table"
        subtitle="Table Subtitle"
      />
    </div>
  );
};
`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const HiddenSearchTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: "Column 1",
      field: "col1",
      highlight: true,
    },
    {
      title: "Column 2",
      field: "col2",
    },
    {
      title: "Numeric value",
      field: "number",
      type: "numeric",
    },
    {
      title: "A Date",
      field: "date",
      type: "date",
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false, search: false }}
        data={testData10}
        columns={columns}
      />
    </div>
  );
};
`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{code:`const SubvalueTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: "Column 1",
      customFilterAndSearch: (
        query,
        row: any // Only needed if you want subvalue searchable
      ) =>
        \`\${row.col1} \${row.subvalue}\`
          .toLocaleUpperCase("en-US")
          .includes(query.toLocaleUpperCase("en-US")),
      field: "col1",
      highlight: true,
      render: (row: any): ReactNode => (
        <SubvalueCell value={row.col1} subvalue={row.subvalue} />
      ),
    },
    {
      title: "Column 2",
      field: "col2",
    },
    {
      title: "Numeric value",
      field: "number",
      type: "numeric",
    },
    {
      title: "A Date",
      field: "date",
      type: "date",
    },
  ];

  return (
    <div className={classes.container}>
      <Table options={{ paging: false }} data={testData10} columns={columns} />
    </div>
  );
};
`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{code:`const DenseTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: "Column 1",
      field: "col1",
      highlight: true,
    },
    {
      title: "Column 2",
      field: "col2",
    },
    {
      title: "Numeric value",
      field: "number",
      type: "numeric",
    },
    {
      title: "A Date",
      field: "date",
      type: "date",
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false, padding: "dense" }}
        data={testData10}
        columns={columns}
        title="Backstage Table"
      />
    </div>
  );
};
`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{code:`const FilterTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: "Column 1",
      field: "col1",
      highlight: true,
    },
    {
      title: "Column 2",
      field: "col2",
    },
    {
      title: "Numeric value",
      field: "number",
      type: "numeric",
    },
    {
      title: "A Date",
      field: "date",
      type: "date",
    },
  ];

  const filters: TableFilter[] = [
    {
      column: "Column 1",
      type: "select",
    },
    {
      column: "Column 2",
      type: "multiple-select",
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false, padding: "dense" }}
        data={testData10}
        columns={columns}
        filters={filters}
      />
    </div>
  );
};
`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{code:`const StyledTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: "Column 1",
      field: "col1",
      highlight: true,
      cellStyle: (_, rowData: any & { tableData: { id: number } }) => {
        return rowData.tableData.id % 2 === 0
          ? {
              color: "#6CD75F",
            }
          : {
              color: "#DC3D5A",
            };
      },
    },
    {
      title: "Column 2",
      field: "col2",
      cellStyle: { color: "#2FA5DC" },
    },
    {
      title: "Numeric value",
      field: "number",
      type: "numeric",
    },
    {
      title: "A Date",
      field: "date",
      type: "date",
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false }}
        data={testData10}
        columns={columns}
        title="Backstage Table"
      />
    </div>
  );
};
`,...p.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const columns: TableColumn[] = [{
    title: 'Column 1',
    field: 'col1',
    highlight: true
  }, {
    title: 'Column 2',
    field: 'col2'
  }, {
    title: 'Numeric value',
    field: 'number',
    type: 'numeric'
  }, {
    title: 'A Date',
    field: 'date',
    type: 'date'
  }];
  return <div className={classes.container}>
      <Table options={{
      paging: false
    }} data={testData10} columns={columns} title="Backstage Table" />
    </div>;
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const columns: TableColumn[] = [{
    title: 'Column 1',
    field: 'col1',
    highlight: true
  }, {
    title: 'Column 2',
    field: 'col2'
  }, {
    title: 'Numeric value',
    field: 'number',
    type: 'numeric'
  }, {
    title: 'A Date',
    field: 'date',
    type: 'date'
  }];
  return <div className={classes.container}>
      <Table options={{
      paging: false
    }} data={[]} columns={columns} isLoading title="Backstage Table" />
    </div>;
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const columns: TableColumn[] = [{
    title: 'Column 1',
    field: 'col1',
    highlight: true
  }, {
    title: 'Column 2',
    field: 'col2'
  }, {
    title: 'Numeric value',
    field: 'number',
    type: 'numeric'
  }, {
    title: 'A Date',
    field: 'date',
    type: 'date'
  }];
  return <div className={classes.container}>
      <Table options={{
      paging: false
    }} data={[]} columns={columns} emptyContent={<div className={classes.empty}>
            No data was added yet,&nbsp;
            <Link to="http://backstage.io/">learn how to add data</Link>.
          </div>} title="Backstage Table" />
    </div>;
}`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const columns: TableColumn[] = [{
    title: 'Column 1',
    field: 'col1',
    highlight: true
  }, {
    title: 'Column 2',
    field: 'col2'
  }, {
    title: 'Numeric value',
    field: 'number',
    type: 'numeric'
  }, {
    title: 'A Date',
    field: 'date',
    type: 'date'
  }];
  return <div className={classes.container}>
      <Table options={{
      paging: false
    }} data={testData10} columns={columns} title="Backstage Table" subtitle="Table Subtitle" />
    </div>;
}`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const columns: TableColumn[] = [{
    title: 'Column 1',
    field: 'col1',
    highlight: true
  }, {
    title: 'Column 2',
    field: 'col2'
  }, {
    title: 'Numeric value',
    field: 'number',
    type: 'numeric'
  }, {
    title: 'A Date',
    field: 'date',
    type: 'date'
  }];
  return <div className={classes.container}>
      <Table options={{
      paging: false,
      search: false
    }} data={testData10} columns={columns} />
    </div>;
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const columns: TableColumn[] = [{
    title: 'Column 1',
    customFilterAndSearch: (query, row // Only needed if you want subvalue searchable
    : any) => \`\${row.col1} \${row.subvalue}\`.toLocaleUpperCase('en-US').includes(query.toLocaleUpperCase('en-US')),
    field: 'col1',
    highlight: true,
    render: (row: any): ReactNode => <SubvalueCell value={row.col1} subvalue={row.subvalue} />
  }, {
    title: 'Column 2',
    field: 'col2'
  }, {
    title: 'Numeric value',
    field: 'number',
    type: 'numeric'
  }, {
    title: 'A Date',
    field: 'date',
    type: 'date'
  }];
  return <div className={classes.container}>
      <Table options={{
      paging: false
    }} data={testData10} columns={columns} />
    </div>;
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const columns: TableColumn[] = [{
    title: 'Column 1',
    field: 'col1',
    highlight: true
  }, {
    title: 'Column 2',
    field: 'col2'
  }, {
    title: 'Numeric value',
    field: 'number',
    type: 'numeric'
  }, {
    title: 'A Date',
    field: 'date',
    type: 'date'
  }];
  return <div className={classes.container}>
      <Table options={{
      paging: false,
      padding: 'dense'
    }} data={testData10} columns={columns} title="Backstage Table" />
    </div>;
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const columns: TableColumn[] = [{
    title: 'Column 1',
    field: 'col1',
    highlight: true
  }, {
    title: 'Column 2',
    field: 'col2'
  }, {
    title: 'Numeric value',
    field: 'number',
    type: 'numeric'
  }, {
    title: 'A Date',
    field: 'date',
    type: 'date'
  }];
  const filters: TableFilter[] = [{
    column: 'Column 1',
    type: 'select'
  }, {
    column: 'Column 2',
    type: 'multiple-select'
  }];
  return <div className={classes.container}>
      <Table options={{
      paging: false,
      padding: 'dense'
    }} data={testData10} columns={columns} filters={filters} />
    </div>;
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const columns: TableColumn[] = [{
    title: 'Column 1',
    field: 'col1',
    highlight: true,
    cellStyle: (_, rowData: any & {
      tableData: {
        id: number;
      };
    }) => {
      return rowData.tableData.id % 2 === 0 ? {
        color: '#6CD75F'
      } : {
        color: '#DC3D5A'
      };
    }
  }, {
    title: 'Column 2',
    field: 'col2',
    cellStyle: {
      color: '#2FA5DC'
    }
  }, {
    title: 'Numeric value',
    field: 'number',
    type: 'numeric'
  }, {
    title: 'A Date',
    field: 'date',
    type: 'date'
  }];
  return <div className={classes.container}>
      <Table options={{
      paging: false
    }} data={testData10} columns={columns} title="Backstage Table" />
    </div>;
}`,...p.parameters?.docs?.source}}};const Ke=["DefaultTable","LoadingTable","EmptyTable","SubtitleTable","HiddenSearchTable","SubvalueTable","DenseTable","FilterTable","StyledTable"];export{s as DefaultTable,m as DenseTable,i as EmptyTable,d as FilterTable,c as HiddenSearchTable,o as LoadingTable,p as StyledTable,r as SubtitleTable,u as SubvalueTable,Ke as __namedExportsOrder,Je as default};
