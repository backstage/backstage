import{bR as l}from"./iframe-BhJ5Dr2k.js";import{B as h}from"./Box-Y2xnXHg0.js";import{m as y}from"./makeStyles-DYyKjhyQ.js";import{T as a}from"./Table-b3kN2h9U.js";import{L as C}from"./Link-CC_KtSOn.js";import"./preload-helper-PPVm8Dsz.js";import"./styled-w-HNwOwS.js";import"./defineProperty-BnPmslM9.js";import"./FilterList-C_sxeQF0.js";import"./Backdrop-Dmvdhia3.js";import"./Grid-DDRFl87z.js";import"./useMediaQuery-DG-bsxsF.js";import"./Select-Bh8KHDzv.js";import"./index-B9sM2jn7.js";import"./Popover-BIoVk5SI.js";import"./Modal-BCl5pik5.js";import"./Portal-wkxcFvaf.js";import"./List-CgBnxwYg.js";import"./ListContext-f6zilHA_.js";import"./formControlState-BHycfnBI.js";import"./Popper-FZP7SLCD.js";import"./RadioGroup-DMO_lFB_.js";import"./SwitchBase-BRWNHgFK.js";import"./Drawer-Bc5wr2-N.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./AccordionDetails-B7ZvhU_V.js";import"./Collapse-pJkUGgh5.js";import"./Avatar-BzAK4cJj.js";import"./Badge-B-qSyIWH.js";import"./BottomNavigationAction-CQ5FnfbV.js";import"./Breadcrumbs-1zc8G6iD.js";import"./Button-DJugJdqz.js";import"./CardContent-3EgiTo2Z.js";import"./CardActions-Ctll2lFR.js";import"./CardHeader-a0HWiRyp.js";import"./CardMedia-cZ_q8osl.js";import"./Checkbox-BOT830k_.js";import"./Chip-CTRiO5UY.js";import"./CircularProgress-BTUbClny.js";import"./CssBaseline-rP9wXMF8.js";import"./DialogTitle-DnRZigSq.js";import"./DialogContentText-BN8_uQOX.js";import"./Divider-DUf9-sOW.js";import"./FormLabel-EGQ9tJa2.js";import"./FormControlLabel-BYfWNrNr.js";import"./TextField-Kh67Ms6T.js";import"./InputLabel-y1SR3PLG.js";import"./InputAdornment-Cjj1sODs.js";import"./LinearProgress-9cp4pMiw.js";import"./ListItem-C_QyLOpG.js";import"./ListItemAvatar-DXXLFLRx.js";import"./ListItemIcon-BViKiT2-.js";import"./ListItemText-BMtWvFgB.js";import"./ListSubheader-CBMB960l.js";import"./MenuItem-B1yXeIUy.js";import"./Remove-BPgotn3w.js";import"./StepLabel-bNEIREem.js";import"./Tabs-CGad9anM.js";import"./KeyboardArrowRight-CIFQlVNH.js";import"./TableRow-DGlh7Mjo.js";import"./TableCell-BoIAGezY.js";import"./TablePagination-CWJd6gma.js";import"./Tooltip-cVotykzK.js";import"./objectSpread2-DN4pOvP4.js";import"./index--C479yzh.js";import"./ChevronRight-DhsbGvOl.js";import"./Edit-BLKxXVQL.js";import"./Search-BnkRKpoY.js";import"./lodash-B1ZVbPgx.js";import"./Select-C4RRa3an.js";import"./Cancel-Qg-KiVmA.js";import"./useAnalytics-DNfXVerI.js";import"./useApp-CYIhR5HZ.js";const T=y(t=>({value:{marginBottom:t.spacing(.75)},subvalue:{color:t.palette.textSubtle,fontWeight:"normal"}}),{name:"BackstageSubvalueCell"});function v(t){const{value:e,subvalue:s}=t,o=T();return l.jsxs(l.Fragment,{children:[l.jsx(h,{className:o.value,children:e}),l.jsx(h,{className:o.subvalue,children:s})]})}v.__docgenInfo={description:"",methods:[],displayName:"SubvalueCell",props:{value:{required:!0,tsType:{name:"ReactNode"},description:""},subvalue:{required:!0,tsType:{name:"ReactNode"},description:""}}};const We={title:"Data Display/Table",component:a,tags:["!manifest"]},i=y(t=>({container:{width:850},empty:{padding:t.spacing(2),display:"flex",justifyContent:"center"}})),N=(t=10)=>{const e=[];for(;e.length<=t;)e.push({col1:`Some value ${e.length}`,col2:`More data ${e.length}`,subvalue:`Subvalue ${e.length}`,number:Math.round(Math.abs(Math.sin(e.length))*1e3),date:new Date(Math.abs(Math.sin(e.length))*1e13)});return e},n=N(10),r=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e,title:"Backstage Table"})})},c=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:[],columns:e,isLoading:!0,title:"Backstage Table"})})},m=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:[],columns:e,emptyContent:l.jsxs("div",{className:t.empty,children:["No data was added yet, ",l.jsx(C,{to:"http://backstage.io/",children:"learn how to add data"}),"."]}),title:"Backstage Table"})})},u=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e,title:"Backstage Table",subtitle:"Table Subtitle"})})},d=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,search:!1},data:n,columns:e})})},p=()=>{const t=i(),e=[{title:"Column 1",customFilterAndSearch:(s,o)=>`${o.col1} ${o.subvalue}`.toLocaleUpperCase("en-US").includes(s.toLocaleUpperCase("en-US")),field:"col1",highlight:!0,render:s=>l.jsx(v,{value:s.col1,subvalue:s.subvalue})},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e})})},g=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,padding:"dense"},data:n,columns:e,title:"Backstage Table"})})},b=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}],s=[{column:"Column 1",type:"select"},{column:"Column 2",type:"multiple-select"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,padding:"dense"},data:n,columns:e,filters:s})})},f=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0,cellStyle:(s,o)=>o.tableData.id%2===0?{color:"#6CD75F"}:{color:"#DC3D5A"}},{title:"Column 2",field:"col2",cellStyle:{color:"#2FA5DC"}},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e,title:"Backstage Table"})})};r.__docgenInfo={description:"",methods:[],displayName:"DefaultTable"};c.__docgenInfo={description:"",methods:[],displayName:"LoadingTable"};m.__docgenInfo={description:"",methods:[],displayName:"EmptyTable"};u.__docgenInfo={description:"",methods:[],displayName:"SubtitleTable"};d.__docgenInfo={description:"",methods:[],displayName:"HiddenSearchTable"};p.__docgenInfo={description:"",methods:[],displayName:"SubvalueTable"};g.__docgenInfo={description:"",methods:[],displayName:"DenseTable"};b.__docgenInfo={description:"",methods:[],displayName:"FilterTable"};f.__docgenInfo={description:"",methods:[],displayName:"StyledTable"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
