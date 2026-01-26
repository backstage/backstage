import{m as y,j as n}from"./iframe-CG856I7g.js";import{B as h}from"./Box-DirFOCIJ.js";import{T as l}from"./Table-CJXnWgYR.js";import{L as C}from"./Link-Cd9n886D.js";import"./preload-helper-PPVm8Dsz.js";import"./styled-8AOit3ty.js";import"./objectWithoutProperties-1QgDkh6r.js";import"./FilterList-CHNkVJrk.js";import"./Backdrop-DWQDC5UU.js";import"./Grid-CG84KQIV.js";import"./useMediaQuery-Dm2wfQ4r.js";import"./Select-BumcGofS.js";import"./index-B9sM2jn7.js";import"./Popover-BVt04z7T.js";import"./Modal-odp3IgY3.js";import"./Portal-Bhu3uB1L.js";import"./List-BTwiC7G-.js";import"./ListContext-BzsI-cEV.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Ckxa1kyG.js";import"./Popper-BTDu7j3q.js";import"./RadioGroup-BLG-tAdo.js";import"./SwitchBase-Dj8cS13X.js";import"./Drawer-DGg_kW9D.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./AccordionDetails-CmfQvp7G.js";import"./Collapse-vpACe9Y2.js";import"./Avatar-5MW-wn_X.js";import"./Badge-BbNpiJEp.js";import"./BottomNavigationAction-BouneejX.js";import"./Breadcrumbs-kb-rzM0h.js";import"./Button-os8mT4aD.js";import"./CardContent-BwT5h854.js";import"./CardActions-CxPYtsdJ.js";import"./CardHeader-BjVEl-5E.js";import"./CardMedia-BFOfeo8i.js";import"./Checkbox-lU_q1h3j.js";import"./Chip-CvfL0To0.js";import"./CircularProgress-DYPLR26Z.js";import"./CssBaseline-CXhDSiz9.js";import"./DialogTitle-BYAFwPKR.js";import"./DialogContentText-Bqk3UbEG.js";import"./Divider-gH4LD_Ra.js";import"./FormLabel-9uCxckxd.js";import"./FormControlLabel-BxAn_c0m.js";import"./TextField-Bp5eKkbH.js";import"./InputLabel-DA4-TPnU.js";import"./InputAdornment-Dh2x7GfQ.js";import"./LinearProgress-GD2gmRBp.js";import"./ListItem-BWUkcOJl.js";import"./ListItemAvatar-DgiPi3S3.js";import"./ListItemIcon-DzmrMaMP.js";import"./Switch-D2aKb9qE.js";import"./ListItemText-QtFV-4wl.js";import"./ListSubheader-C1JPDmOA.js";import"./MenuItem-DhNEnkRz.js";import"./Remove-DHA5FxCI.js";import"./StepLabel-DZipxATG.js";import"./Tabs-CVC-uJPv.js";import"./KeyboardArrowRight-C_56xVhe.js";import"./TableRow-3LoaSxu_.js";import"./TableCell-E5hXV4DF.js";import"./TablePagination-gmiz2r1t.js";import"./Tooltip-DTkgI76M.js";import"./objectSpread2-DCfELgjw.js";import"./ChevronRight-Ly737Qg-.js";import"./Edit-CzpsaNUY.js";import"./Search-S9ejjMwF.js";import"./lodash-Czox7iJy.js";import"./Select-8ALuceWs.js";import"./Cancel-DWbQDfJV.js";import"./index-PWNHdhKk.js";import"./useAnalytics-D5P-YjA8.js";import"./useApp-CtCgKAFa.js";const T=y(t=>({value:{marginBottom:t.spacing(.75)},subvalue:{color:t.palette.textSubtle,fontWeight:"normal"}}),{name:"BackstageSubvalueCell"});function v(t){const{value:e,subvalue:a}=t,g=T();return n.jsxs(n.Fragment,{children:[n.jsx(h,{className:g.value,children:e}),n.jsx(h,{className:g.subvalue,children:a})]})}v.__docgenInfo={description:"",methods:[],displayName:"SubvalueCell",props:{value:{required:!0,tsType:{name:"ReactNode"},description:""},subvalue:{required:!0,tsType:{name:"ReactNode"},description:""}}};const ze={title:"Data Display/Table",component:l,tags:["!manifest"]},b=y(t=>({container:{width:850},empty:{padding:t.spacing(2),display:"flex",justifyContent:"center"}})),N=(t=10)=>{const e=[];for(;e.length<=t;)e.push({col1:`Some value ${e.length}`,col2:`More data ${e.length}`,subvalue:`Subvalue ${e.length}`,number:Math.round(Math.abs(Math.sin(e.length))*1e3),date:new Date(Math.abs(Math.sin(e.length))*1e13)});return e},f=N(10),s=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:f,columns:e,title:"Backstage Table"})})},o=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:[],columns:e,isLoading:!0,title:"Backstage Table"})})},i=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:[],columns:e,emptyContent:n.jsxs("div",{className:t.empty,children:["No data was added yet, ",n.jsx(C,{to:"http://backstage.io/",children:"learn how to add data"}),"."]}),title:"Backstage Table"})})},c=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:f,columns:e,title:"Backstage Table",subtitle:"Table Subtitle"})})},r=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1,search:!1},data:f,columns:e})})},u=()=>{const t=b(),e=[{title:"Column 1",customFilterAndSearch:(a,g)=>`${g.col1} ${g.subvalue}`.toLocaleUpperCase("en-US").includes(a.toLocaleUpperCase("en-US")),field:"col1",highlight:!0,render:a=>n.jsx(v,{value:a.col1,subvalue:a.subvalue})},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:f,columns:e})})},m=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1,padding:"dense"},data:f,columns:e,title:"Backstage Table"})})},d=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}],a=[{column:"Column 1",type:"select"},{column:"Column 2",type:"multiple-select"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1,padding:"dense"},data:f,columns:e,filters:a})})},p=()=>{const t=b(),e=[{title:"Column 1",field:"col1",highlight:!0,cellStyle:(a,g)=>g.tableData.id%2===0?{color:"#6CD75F"}:{color:"#DC3D5A"}},{title:"Column 2",field:"col2",cellStyle:{color:"#2FA5DC"}},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return n.jsx("div",{className:t.container,children:n.jsx(l,{options:{paging:!1},data:f,columns:e,title:"Backstage Table"})})};s.__docgenInfo={description:"",methods:[],displayName:"DefaultTable"};o.__docgenInfo={description:"",methods:[],displayName:"LoadingTable"};i.__docgenInfo={description:"",methods:[],displayName:"EmptyTable"};c.__docgenInfo={description:"",methods:[],displayName:"SubtitleTable"};r.__docgenInfo={description:"",methods:[],displayName:"HiddenSearchTable"};u.__docgenInfo={description:"",methods:[],displayName:"SubvalueTable"};m.__docgenInfo={description:"",methods:[],displayName:"DenseTable"};d.__docgenInfo={description:"",methods:[],displayName:"FilterTable"};p.__docgenInfo={description:"",methods:[],displayName:"StyledTable"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const DefaultTable = () => {
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
`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const SubtitleTable = () => {
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
`,...c.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const HiddenSearchTable = () => {
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
`,...r.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{code:`const SubvalueTable = () => {
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
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
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
}`,...c.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
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
}`,...p.parameters?.docs?.source}}};const Ge=["DefaultTable","LoadingTable","EmptyTable","SubtitleTable","HiddenSearchTable","SubvalueTable","DenseTable","FilterTable","StyledTable"];export{s as DefaultTable,m as DenseTable,i as EmptyTable,d as FilterTable,r as HiddenSearchTable,o as LoadingTable,p as StyledTable,c as SubtitleTable,u as SubvalueTable,Ge as __namedExportsOrder,ze as default};
