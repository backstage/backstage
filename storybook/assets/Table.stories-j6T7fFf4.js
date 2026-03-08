import{j as n}from"./iframe-C7l5P2_I.js";import{m as y}from"./makeStyles-DO0dhQTG.js";import{B as h}from"./Box-CnwfTMBK.js";import{T as l}from"./Table-HzhsKJKl.js";import{L as C}from"./Link-DErIwACF.js";import"./preload-helper-PPVm8Dsz.js";import"./styled-BQ5_1fzN.js";import"./objectWithoutProperties-CuQYdgpX.js";import"./FilterList-BaBv03Jk.js";import"./Backdrop-BaI6MFq9.js";import"./Grid-3Bz-t9Mk.js";import"./useMediaQuery-DZhcWUcO.js";import"./Select-DtfcHVIh.js";import"./index-B9sM2jn7.js";import"./Popover-B2wLjBT4.js";import"./Modal-irLIXdct.js";import"./Portal-YwRf0OFq.js";import"./List-C_Ju4KCi.js";import"./ListContext-Dobuofun.js";import"./formControlState-Cg625is9.js";import"./Popper-CuIlqdpq.js";import"./RadioGroup-B0v49KG2.js";import"./SwitchBase-B1krwLlg.js";import"./Drawer-C4YzMgDw.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./AccordionDetails-Ctvsfxbt.js";import"./Collapse-Ch0HaP0g.js";import"./Avatar-BY0E2ivn.js";import"./Badge-yyToWMTy.js";import"./BottomNavigationAction-pffqPHsL.js";import"./Breadcrumbs-t7NYEu_Q.js";import"./Button-D7Ao-a7e.js";import"./CardContent-Cb473dxQ.js";import"./CardActions-D19Agmvc.js";import"./CardHeader-C5zJYPmL.js";import"./CardMedia-DtVTKj5Q.js";import"./Checkbox-Pj7D5a7g.js";import"./Chip-BF6e1TPJ.js";import"./CircularProgress-DY04Nvpa.js";import"./CssBaseline-CXr6n43j.js";import"./DialogTitle-unfTSm9Q.js";import"./DialogContentText-Bq8nglGU.js";import"./Divider-5Td0Zzlj.js";import"./FormLabel-BduOcCS6.js";import"./FormControlLabel-MDJRnT8W.js";import"./TextField-B7UhiS5j.js";import"./InputLabel-BzXMwAn9.js";import"./InputAdornment-Bj8RPjdS.js";import"./LinearProgress-CmuwQZTf.js";import"./ListItem-DkGdhH3Z.js";import"./ListItemAvatar-DBOQZMTM.js";import"./ListItemIcon-C3_VkfIf.js";import"./ListItemText-BiXUwKFP.js";import"./ListSubheader-jh3HeXmJ.js";import"./MenuItem-wX1DH0fS.js";import"./Remove-DkdFpR8f.js";import"./StepLabel-D1MhHe3t.js";import"./Tabs-BvjGPY8g.js";import"./KeyboardArrowRight-Dtbg4m6Y.js";import"./TableRow-FbNRjaXj.js";import"./TableCell-DzSiq1Wh.js";import"./TablePagination-6CV80G_8.js";import"./Tooltip-DXtsjz2q.js";import"./objectSpread2-C3KPw3QO.js";import"./index-DlhmoIZL.js";import"./ChevronRight-E-BS2GXR.js";import"./Edit-CtmE6InU.js";import"./Search-C1ZK11T8.js";import"./lodash-C_n5Ni0i.js";import"./Select-BaI2YuA7.js";import"./Cancel-cb8057xf.js";import"./index-Ct-Fv-qt.js";import"./useAnalytics-DvfsJVgo.js";import"./useApp-B0ylAoYl.js";const T=y(t=>({value:{marginBottom:t.spacing(.75)},subvalue:{color:t.palette.textSubtle,fontWeight:"normal"}}),{name:"BackstageSubvalueCell"});function v(t){const{value:e,subvalue:a}=t,g=T();return n.jsxs(n.Fragment,{children:[n.jsx(h,{className:g.value,children:e}),n.jsx(h,{className:g.subvalue,children:a})]})}v.__docgenInfo={description:"",methods:[],displayName:"SubvalueCell",props:{value:{required:!0,tsType:{name:"ReactNode"},description:""},subvalue:{required:!0,tsType:{name:"ReactNode"},description:""}}};const ze={title:"Data Display/Table",component:l,tags:["!manifest"]},b=y(t=>({container:{width:850},empty:{padding:t.spacing(2),display:"flex",justifyContent:"center"}})),N=(t=10)=>{const e=[];for(;e.length<=t;)e.push({col1:`Some value ${e.length}`,col2:`More data ${e.length}`,subvalue:`Subvalue ${e.length}`,number:Math.round(Math.abs(Math.sin(e.length))*1e3),date:new Date(Math.abs(Math.sin(e.length))*1e13)});return e},f=N(10),s=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:f,columns:e,title:"Backstage Table"})})},o=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:[],columns:e,isLoading:!0,title:"Backstage Table"})})},i=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:[],columns:e,emptyContent:n.jsxs("div",{className:t.empty,children:["No data was added yet, ",n.jsx(C,{to:"http://backstage.io/",children:"learn how to add data"}),"."]}),title:"Backstage Table"})})},r=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:f,columns:e,title:"Backstage Table",subtitle:"Table Subtitle"})})},c=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1,search:!1},data:f,columns:e})})},u=()=>{const t=b(),e=[{title:"Column 1",customFilterAndSearch:(a,g)=>`${g.col1} ${g.subvalue}`.toLocaleUpperCase("en-US").includes(a.toLocaleUpperCase("en-US")),field:"col1",highlight:!0,render:a=>n.jsx(v,{value:a.col1,subvalue:a.subvalue})},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:f,columns:e})})},m=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1,padding:"dense"},data:f,columns:e,title:"Backstage Table"})})},d=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}],a=[{column:"Column 1",type:"select"},{column:"Column 2",type:"multiple-select"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1,padding:"dense"},data:f,columns:e,filters:a})})},p=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0,cellStyle:(a,g)=>g.tableData.id%2===0?{color:"#6CD75F"}:{color:"#DC3D5A"}},{title:"Column 2",field:"col2",cellStyle:{color:"#2FA5DC"}},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:f,columns:e,title:"Backstage Table"})})};s.__docgenInfo={description:"",methods:[],displayName:"DefaultTable"};o.__docgenInfo={description:"",methods:[],displayName:"LoadingTable"};i.__docgenInfo={description:"",methods:[],displayName:"EmptyTable"};r.__docgenInfo={description:"",methods:[],displayName:"SubtitleTable"};c.__docgenInfo={description:"",methods:[],displayName:"HiddenSearchTable"};u.__docgenInfo={description:"",methods:[],displayName:"SubvalueTable"};m.__docgenInfo={description:"",methods:[],displayName:"DenseTable"};d.__docgenInfo={description:"",methods:[],displayName:"FilterTable"};p.__docgenInfo={description:"",methods:[],displayName:"StyledTable"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const DefaultTable = () => {
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
}`,...p.parameters?.docs?.source}}};const Ge=["DefaultTable","LoadingTable","EmptyTable","SubtitleTable","HiddenSearchTable","SubvalueTable","DenseTable","FilterTable","StyledTable"];export{s as DefaultTable,m as DenseTable,i as EmptyTable,d as FilterTable,c as HiddenSearchTable,o as LoadingTable,p as StyledTable,r as SubtitleTable,u as SubvalueTable,Ge as __namedExportsOrder,ze as default};
