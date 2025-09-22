import{m as y,j as l}from"./iframe-BKfEGE7G.js";import{B as h}from"./Box-BJlQ2iQy.js";import{T as a}from"./Table-BnimhSM2.js";import{L as C}from"./Link-CDMP9pev.js";import"./preload-helper-D9Z9MdNV.js";import"./styled-B4-rL4TL.js";import"./objectWithoutProperties-BtxRDVf_.js";import"./FilterList-DlHEGo5A.js";import"./Backdrop-TvGNQn7O.js";import"./Grid-vX9qBbX0.js";import"./useMediaQuery-DTZzhyji.js";import"./Select-HjZKhiCT.js";import"./index-DnL3XN75.js";import"./Popover-BDMv4xbF.js";import"./Modal-CvEZPVbb.js";import"./Portal-Dl4iECMi.js";import"./List-xqk2zBI-.js";import"./ListContext-1tRnwUCo.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DkGOq8F2.js";import"./Popper-Cl6P73dl.js";import"./RadioGroup-DY8AY5HH.js";import"./SwitchBase-B153thNd.js";import"./Drawer-D1BrYRQp.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./AccordionDetails-DO5qN2es.js";import"./Collapse-Bj6_bX8n.js";import"./Avatar-DIC6JXhX.js";import"./Badge-yi968Hay.js";import"./BottomNavigationAction-DrATH56j.js";import"./Breadcrumbs-CeVPXq0i.js";import"./Button-CBt-BxVf.js";import"./CardContent-DrXXBE5X.js";import"./CardActions-D1j0vYEk.js";import"./CardHeader-pOr2jc7f.js";import"./CardMedia-DgF0qTjv.js";import"./Checkbox-CgKQJ5Kl.js";import"./Chip-BCkfe9Oa.js";import"./CircularProgress-DFNfoFCz.js";import"./DialogTitle-COtGSIrZ.js";import"./DialogContentText-BOHQMPP2.js";import"./Divider-B7pMmKOl.js";import"./FormLabel-rWNDR_CN.js";import"./FormControlLabel-3PKAlnIs.js";import"./TextField-GrIBMvZl.js";import"./InputLabel-Cewi00W0.js";import"./InputAdornment-BnRACK9W.js";import"./LinearProgress-ONnmqoew.js";import"./ListItem-DH54cTxL.js";import"./ListItemAvatar-DLQfyFjg.js";import"./ListItemIcon-CGMSEMC9.js";import"./Switch-DL9JGeVv.js";import"./ListItemText-DfnmZGrz.js";import"./ListSubheader-Pbbd6IcY.js";import"./MenuItem-DU6GWwGa.js";import"./Remove-DLqXwkmh.js";import"./StepLabel-CkWiBFl_.js";import"./Tabs-BTlYueFk.js";import"./KeyboardArrowRight-DoJadC5j.js";import"./TableRow-DmogWFId.js";import"./TableCell-Ci33VeEo.js";import"./TablePagination-BGQWJBhc.js";import"./Tooltip-BkpGifwK.js";import"./objectSpread2-BZDIfuXC.js";import"./ChevronRight-Cuyy43vR.js";import"./Edit-DTNLlZ9b.js";import"./Search-niI_9iNc.js";import"./lodash-CwBbdt2Q.js";import"./Select-C_I3O_xg.js";import"./Cancel-DkRsd8Pp.js";import"./index-DxVjIFhW.js";import"./useAnalytics-BLOfhO-l.js";import"./useApp-_11zMdcF.js";const T=y(t=>({value:{marginBottom:t.spacing(.75)},subvalue:{color:t.palette.textSubtle,fontWeight:"normal"}}),{name:"BackstageSubvalueCell"});function v(t){const{value:e,subvalue:s}=t,o=T();return l.jsxs(l.Fragment,{children:[l.jsx(h,{className:o.value,children:e}),l.jsx(h,{className:o.subvalue,children:s})]})}v.__docgenInfo={description:"",methods:[],displayName:"SubvalueCell",props:{value:{required:!0,tsType:{name:"ReactNode"},description:""},subvalue:{required:!0,tsType:{name:"ReactNode"},description:""}}};const We={title:"Data Display/Table",component:a},i=y(t=>({container:{width:850},empty:{padding:t.spacing(2),display:"flex",justifyContent:"center"}})),N=(t=10)=>{const e=[];for(;e.length<=t;)e.push({col1:`Some value ${e.length}`,col2:`More data ${e.length}`,subvalue:`Subvalue ${e.length}`,number:Math.round(Math.abs(Math.sin(e.length))*1e3),date:new Date(Math.abs(Math.sin(e.length))*1e13)});return e},n=N(10),r=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e,title:"Backstage Table"})})},c=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:[],columns:e,isLoading:!0,title:"Backstage Table"})})},m=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:[],columns:e,emptyContent:l.jsxs("div",{className:t.empty,children:["No data was added yet, ",l.jsx(C,{to:"http://backstage.io/",children:"learn how to add data"}),"."]}),title:"Backstage Table"})})},u=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e,title:"Backstage Table",subtitle:"Table Subtitle"})})},d=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,search:!1},data:n,columns:e})})},p=()=>{const t=i(),e=[{title:"Column 1",customFilterAndSearch:(s,o)=>`${o.col1} ${o.subvalue}`.toLocaleUpperCase("en-US").includes(s.toLocaleUpperCase("en-US")),field:"col1",highlight:!0,render:s=>l.jsx(v,{value:s.col1,subvalue:s.subvalue})},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e})})},g=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,padding:"dense"},data:n,columns:e,title:"Backstage Table"})})},b=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}],s=[{column:"Column 1",type:"select"},{column:"Column 2",type:"multiple-select"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,padding:"dense"},data:n,columns:e,filters:s})})},f=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0,cellStyle:(s,o)=>o.tableData.id%2===0?{color:"#6CD75F"}:{color:"#DC3D5A"}},{title:"Column 2",field:"col2",cellStyle:{color:"#2FA5DC"}},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:n,columns:e,title:"Backstage Table"})})};r.__docgenInfo={description:"",methods:[],displayName:"DefaultTable"};c.__docgenInfo={description:"",methods:[],displayName:"LoadingTable"};m.__docgenInfo={description:"",methods:[],displayName:"EmptyTable"};u.__docgenInfo={description:"",methods:[],displayName:"SubtitleTable"};d.__docgenInfo={description:"",methods:[],displayName:"HiddenSearchTable"};p.__docgenInfo={description:"",methods:[],displayName:"SubvalueTable"};g.__docgenInfo={description:"",methods:[],displayName:"DenseTable"};b.__docgenInfo={description:"",methods:[],displayName:"FilterTable"};f.__docgenInfo={description:"",methods:[],displayName:"StyledTable"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
