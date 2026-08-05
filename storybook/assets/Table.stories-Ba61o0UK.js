import{bR as l}from"./iframe-CMKJKLUT.js";import{B as h}from"./Box-CcFL9itu.js";import{m as y}from"./makeStyles-CXoO9pfI.js";import{T as a}from"./Table-B1I5Qw8w.js";import{L as C}from"./Link-C7EGKb3p.js";import"./preload-helper-PPVm8Dsz.js";import"./styled-DkbS0659.js";import"./defineProperty-vav_6MNU.js";import"./FilterList-DGwvMpDq.js";import"./Backdrop-DWhgVM4n.js";import"./Grid-UmxeFSJB.js";import"./useMediaQuery-Ce5CPtgY.js";import"./Select-CjY9yD6p.js";import"./index-B9sM2jn7.js";import"./Popover-R_8ybVQZ.js";import"./Modal-DxIGJueK.js";import"./Portal-C_-ZAH0t.js";import"./List-Dqpl4jxs.js";import"./ListContext-CStQo49q.js";import"./formControlState-ja4vniRg.js";import"./Popper-B0SQBiNE.js";import"./RadioGroup-BPAZcmsh.js";import"./SwitchBase-BBrJ33xy.js";import"./Drawer-CzlxhCXI.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./AccordionDetails-C7lg9HDC.js";import"./Collapse-BfaQXjdc.js";import"./Avatar-CuuEeRsT.js";import"./Badge-_q1OaaV-.js";import"./BottomNavigationAction-CTBr-HPT.js";import"./Breadcrumbs-D0jXOiks.js";import"./Button-BkDY9UjV.js";import"./CardContent-ChOwIhNd.js";import"./CardActions-BhmlAmBj.js";import"./CardHeader-Bqm6l0rv.js";import"./CardMedia-xnJVoZth.js";import"./Checkbox-oX-XbCdN.js";import"./Chip-9rkaVTEZ.js";import"./CircularProgress-DDuRzUz-.js";import"./CssBaseline-DnkKGySk.js";import"./DialogTitle-DWMUtupT.js";import"./DialogContentText-VsfNAANZ.js";import"./Divider-B8kBeCp6.js";import"./FormLabel-DxWI9h2z.js";import"./FormControlLabel-adDFNiYS.js";import"./TextField-BbKSflrw.js";import"./InputLabel-DTAEhDw2.js";import"./InputAdornment--JKn_lvP.js";import"./LinearProgress-Bb6vhX_n.js";import"./ListItem--taqkzDX.js";import"./ListItemAvatar-D2UhoXwh.js";import"./ListItemIcon-Bz6vf59e.js";import"./ListItemText-5TxI4qRi.js";import"./ListSubheader-CPzhzimg.js";import"./MenuItem-DvrN87VN.js";import"./Remove-Dn7CitnZ.js";import"./StepLabel-Ds_z4YKD.js";import"./Tabs-B86FDJpX.js";import"./KeyboardArrowRight-BbkJGD5f.js";import"./TableRow--vn2QuoK.js";import"./TableCell-VsYhzVKx.js";import"./TablePagination-BSOuRrLO.js";import"./Tooltip-Cco8s-30.js";import"./objectSpread2-B3xgOQeJ.js";import"./index-C_93cPm_.js";import"./ChevronRight-Bh2dRRUn.js";import"./Edit-CrihO5pr.js";import"./Search-CM5gwqw2.js";import"./lodash-BVa2wb4L.js";import"./Select-HAJLqm90.js";import"./Cancel-DF5xLhgu.js";import"./useAnalytics-CnatrMx6.js";import"./useApp-jTIyofwr.js";const T=y(t=>({value:{marginBottom:t.spacing(.75)},subvalue:{color:t.palette.textSubtle,fontWeight:"normal"}}),{name:"BackstageSubvalueCell"});function v(t){const{value:e,subvalue:s}=t,o=T();return l.jsxs(l.Fragment,{children:[l.jsx(h,{className:o.value,children:e}),l.jsx(h,{className:o.subvalue,children:s})]})}v.__docgenInfo={description:"",methods:[],displayName:"SubvalueCell",props:{value:{required:!0,tsType:{name:"ReactNode"},description:""},subvalue:{required:!0,tsType:{name:"ReactNode"},description:""}}};const We={title:"Data Display/Table",component:a,tags:["!manifest"]},i=y(t=>({container:{width:850},empty:{padding:t.spacing(2),display:"flex",justifyContent:"center"}})),N=(t=10)=>{const e=[];for(;e.length<=t;)e.push({col1:`Some value ${e.length}`,col2:`More data ${e.length}`,subvalue:`Subvalue ${e.length}`,number:Math.round(Math.abs(Math.sin(e.length))*1e3),date:new Date(Math.abs(Math.sin(e.length))*1e13)});return e},n=N(10),r=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e,title:"Backstage Table"})})},c=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:[],columns:e,isLoading:!0,title:"Backstage Table"})})},m=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:[],columns:e,emptyContent:l.jsxs("div",{className:t.empty,children:["No data was added yet, ",l.jsx(C,{to:"http://backstage.io/",children:"learn how to add data"}),"."]}),title:"Backstage Table"})})},u=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e,title:"Backstage Table",subtitle:"Table Subtitle"})})},d=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,search:!1},data:n,columns:e})})},p=()=>{const t=i(),e=[{title:"Column 1",customFilterAndSearch:(s,o)=>`${o.col1} ${o.subvalue}`.toLocaleUpperCase("en-US").includes(s.toLocaleUpperCase("en-US")),field:"col1",highlight:!0,render:s=>l.jsx(v,{value:s.col1,subvalue:s.subvalue})},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e})})},g=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,padding:"dense"},data:n,columns:e,title:"Backstage Table"})})},b=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}],s=[{column:"Column 1",type:"select"},{column:"Column 2",type:"multiple-select"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,padding:"dense"},data:n,columns:e,filters:s})})},f=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0,cellStyle:(s,o)=>o.tableData.id%2===0?{color:"#6CD75F"}:{color:"#DC3D5A"}},{title:"Column 2",field:"col2",cellStyle:{color:"#2FA5DC"}},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e,title:"Backstage Table"})})};r.__docgenInfo={description:"",methods:[],displayName:"DefaultTable"};c.__docgenInfo={description:"",methods:[],displayName:"LoadingTable"};m.__docgenInfo={description:"",methods:[],displayName:"EmptyTable"};u.__docgenInfo={description:"",methods:[],displayName:"SubtitleTable"};d.__docgenInfo={description:"",methods:[],displayName:"HiddenSearchTable"};p.__docgenInfo={description:"",methods:[],displayName:"SubvalueTable"};g.__docgenInfo={description:"",methods:[],displayName:"DenseTable"};b.__docgenInfo={description:"",methods:[],displayName:"FilterTable"};f.__docgenInfo={description:"",methods:[],displayName:"StyledTable"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
      paging: false
    }} data={[]} columns={columns} isLoading title="Backstage Table" />
    </div>;
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
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
}`,...u.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
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
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => {
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
}`,...g.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`() => {
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
}`,...b.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`() => {
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
}`,...f.parameters?.docs?.source}}};const ze=["DefaultTable","LoadingTable","EmptyTable","SubtitleTable","HiddenSearchTable","SubvalueTable","DenseTable","FilterTable","StyledTable"];export{r as DefaultTable,g as DenseTable,m as EmptyTable,b as FilterTable,d as HiddenSearchTable,c as LoadingTable,f as StyledTable,u as SubtitleTable,p as SubvalueTable,ze as __namedExportsOrder,We as default};
