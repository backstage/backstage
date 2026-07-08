import{bR as l}from"./iframe-DUP7Kr9f.js";import{B as h}from"./Box-D9WPCwYT.js";import{m as y}from"./makeStyles-Dd-C4kag.js";import{T as a}from"./Table-DH0sKXK_.js";import{L as C}from"./Link-BDaMnIWB.js";import"./preload-helper-PPVm8Dsz.js";import"./styled-Cg0H8rnn.js";import"./defineProperty-BE9kHWth.js";import"./FilterList-CoyE_fYG.js";import"./Backdrop-CMzQS3A4.js";import"./Grid-Cd5C4HAL.js";import"./useMediaQuery-Yd7n6uPd.js";import"./Select-DutwxEIX.js";import"./index-B9sM2jn7.js";import"./Popover-CDJLQ0IP.js";import"./Modal-W9vmQpMY.js";import"./Portal-D333kJ5H.js";import"./List-C1Kz1ZAt.js";import"./ListContext-Cuf4_omo.js";import"./formControlState-9ZpYTiSp.js";import"./Popper-DDikz6cp.js";import"./RadioGroup-MTXtA_rB.js";import"./SwitchBase-43-G-ANU.js";import"./Drawer-gTEg8TfG.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./AccordionDetails-9j3J5__4.js";import"./Collapse-BNEqbWFL.js";import"./Avatar-LyHZh9Ii.js";import"./Badge-C0O2JRat.js";import"./BottomNavigationAction-CKCrK_df.js";import"./Breadcrumbs-BaXR-Nxe.js";import"./Button-D-BEBcdv.js";import"./CardContent-CmNV6xZ6.js";import"./CardActions-BMFHVOb1.js";import"./CardHeader-DJHbhkAQ.js";import"./CardMedia-D1AQY8AG.js";import"./Checkbox-DUgWuq5O.js";import"./Chip-DwbFjTHJ.js";import"./CircularProgress-DtnWqY7I.js";import"./CssBaseline-BqlOmTSi.js";import"./DialogTitle-B66uY9Xn.js";import"./DialogContentText-CrEVLOhj.js";import"./Divider-DfV7_Pd4.js";import"./FormLabel-Du5eM7ft.js";import"./FormControlLabel-DwOLbH9b.js";import"./TextField-Db7ImgTx.js";import"./InputLabel-D5_9uFgA.js";import"./InputAdornment-CaLVRimp.js";import"./LinearProgress-BevsRAd0.js";import"./ListItem-CWB1REQF.js";import"./ListItemAvatar-CWhVDGxo.js";import"./ListItemIcon-Dfvfo0Ir.js";import"./ListItemText-BJOFrCLO.js";import"./ListSubheader-DRjrjtk7.js";import"./MenuItem-Cv5YCDok.js";import"./Remove-D2TYueIt.js";import"./StepLabel-DqjqP8p6.js";import"./Tabs-CpMZR3GM.js";import"./KeyboardArrowRight-Ch_q3QYE.js";import"./TableRow-DIyLr_jB.js";import"./TableCell-DcGuWSGq.js";import"./TablePagination-Ckw6qEO5.js";import"./Tooltip-B9D26I6o.js";import"./objectSpread2-CFHRsR29.js";import"./index-C5YDA-DN.js";import"./ChevronRight-C-BEnYs0.js";import"./Edit-D_d1guK3.js";import"./Search-BjQvgrDJ.js";import"./lodash-1-sk3vtf.js";import"./Select-L-TM4GCe.js";import"./Cancel-3HT5ENVC.js";import"./useAnalytics-DTHv5VM-.js";import"./useApp-DuupV57f.js";const T=y(t=>({value:{marginBottom:t.spacing(.75)},subvalue:{color:t.palette.textSubtle,fontWeight:"normal"}}),{name:"BackstageSubvalueCell"});function v(t){const{value:e,subvalue:s}=t,o=T();return l.jsxs(l.Fragment,{children:[l.jsx(h,{className:o.value,children:e}),l.jsx(h,{className:o.subvalue,children:s})]})}v.__docgenInfo={description:"",methods:[],displayName:"SubvalueCell",props:{value:{required:!0,tsType:{name:"ReactNode"},description:""},subvalue:{required:!0,tsType:{name:"ReactNode"},description:""}}};const We={title:"Data Display/Table",component:a,tags:["!manifest"]},i=y(t=>({container:{width:850},empty:{padding:t.spacing(2),display:"flex",justifyContent:"center"}})),N=(t=10)=>{const e=[];for(;e.length<=t;)e.push({col1:`Some value ${e.length}`,col2:`More data ${e.length}`,subvalue:`Subvalue ${e.length}`,number:Math.round(Math.abs(Math.sin(e.length))*1e3),date:new Date(Math.abs(Math.sin(e.length))*1e13)});return e},n=N(10),r=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e,title:"Backstage Table"})})},c=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:[],columns:e,isLoading:!0,title:"Backstage Table"})})},m=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:[],columns:e,emptyContent:l.jsxs("div",{className:t.empty,children:["No data was added yet, ",l.jsx(C,{to:"http://backstage.io/",children:"learn how to add data"}),"."]}),title:"Backstage Table"})})},u=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e,title:"Backstage Table",subtitle:"Table Subtitle"})})},d=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,search:!1},data:n,columns:e})})},p=()=>{const t=i(),e=[{title:"Column 1",customFilterAndSearch:(s,o)=>`${o.col1} ${o.subvalue}`.toLocaleUpperCase("en-US").includes(s.toLocaleUpperCase("en-US")),field:"col1",highlight:!0,render:s=>l.jsx(v,{value:s.col1,subvalue:s.subvalue})},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e})})},g=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,padding:"dense"},data:n,columns:e,title:"Backstage Table"})})},b=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}],s=[{column:"Column 1",type:"select"},{column:"Column 2",type:"multiple-select"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,padding:"dense"},data:n,columns:e,filters:s})})},f=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0,cellStyle:(s,o)=>o.tableData.id%2===0?{color:"#6CD75F"}:{color:"#DC3D5A"}},{title:"Column 2",field:"col2",cellStyle:{color:"#2FA5DC"}},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e,title:"Backstage Table"})})};r.__docgenInfo={description:"",methods:[],displayName:"DefaultTable"};c.__docgenInfo={description:"",methods:[],displayName:"LoadingTable"};m.__docgenInfo={description:"",methods:[],displayName:"EmptyTable"};u.__docgenInfo={description:"",methods:[],displayName:"SubtitleTable"};d.__docgenInfo={description:"",methods:[],displayName:"HiddenSearchTable"};p.__docgenInfo={description:"",methods:[],displayName:"SubvalueTable"};g.__docgenInfo={description:"",methods:[],displayName:"DenseTable"};b.__docgenInfo={description:"",methods:[],displayName:"FilterTable"};f.__docgenInfo={description:"",methods:[],displayName:"StyledTable"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
