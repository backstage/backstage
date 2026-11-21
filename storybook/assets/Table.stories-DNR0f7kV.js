import{j as l}from"./iframe-81VbGqYS.js";import{B as h}from"./Box-BgoSIZ4q.js";import{m as y}from"./makeStyles-CLUNqzBM.js";import{T as a}from"./Table-OM3WzEqH.js";import{L as C}from"./Link-DgC69_CC.js";import"./preload-helper-PPVm8Dsz.js";import"./styled-eVahdZR4.js";import"./defineProperty-DCk0cOA9.js";import"./FilterList-hHrB4lXx.js";import"./Backdrop-CLxOsBc9.js";import"./Grid-DMrlSwZy.js";import"./useMediaQuery-C8Gf-FN3.js";import"./Select-BzXViqa9.js";import"./index-B9sM2jn7.js";import"./Popover-DLFZ7T5B.js";import"./Modal-FnVT5N6T.js";import"./Portal-QfMZdSdo.js";import"./List-DIoifV4W.js";import"./ListContext-CiutZ7F_.js";import"./formControlState-Bx7UkWfI.js";import"./Popper-Br0-G0xX.js";import"./RadioGroup-DwVhWde4.js";import"./SwitchBase-CToxlN0_.js";import"./Drawer-Ok3s60kk.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./AccordionDetails-Zz6eKI1V.js";import"./Collapse-BjQrsG8d.js";import"./Avatar-CBIlLMLm.js";import"./Badge-CBKUCu1L.js";import"./BottomNavigationAction-C1UMFj4D.js";import"./Breadcrumbs-DBxoW7WU.js";import"./Button-Dqr-Z-RQ.js";import"./CardContent-CdXGJVJ5.js";import"./CardActions-BMXcmTTj.js";import"./CardHeader-GTM5GDqv.js";import"./CardMedia-DPQPW3Ld.js";import"./Checkbox-CHyOnYAh.js";import"./Chip-C8qNuiRs.js";import"./CircularProgress-Dk1o82QE.js";import"./CssBaseline-BM5g4aFo.js";import"./DialogTitle-wgouaPsN.js";import"./DialogContentText-BoejhHRr.js";import"./Divider-C6TLtV4P.js";import"./FormLabel-DZbq3sWy.js";import"./FormControlLabel-CAUU0ih-.js";import"./TextField-DuwN4RVN.js";import"./InputLabel-B5-2gtgt.js";import"./InputAdornment-fkZkbIh_.js";import"./LinearProgress-C66E09sW.js";import"./ListItem-BwaGLIri.js";import"./ListItemAvatar-bTfUGv_t.js";import"./ListItemIcon-BU4x6kL0.js";import"./ListItemText-BJVQ0grI.js";import"./ListSubheader-CvXMUVuD.js";import"./MenuItem-DPZFNAAH.js";import"./Remove-BU-SBgHH.js";import"./StepLabel-WKNGnwmO.js";import"./Tabs-CnExKjem.js";import"./KeyboardArrowRight-XiU7cU0I.js";import"./TableRow-DzqzPM46.js";import"./TableCell-Bq3CAaQn.js";import"./TablePagination-c6FjG9Ri.js";import"./Tooltip-BkS0CJ7s.js";import"./objectSpread2-DDlpRPxv.js";import"./index-CUwVFkQ3.js";import"./ChevronRight-J5nI6-x-.js";import"./Edit-CshlwQNL.js";import"./Search-DnoMFe04.js";import"./lodash-BPAWgrT_.js";import"./Select-B2NL8kHq.js";import"./Cancel-Byl0DReS.js";import"./useApp-Bu-r3o5K.js";import"./index-BTbib15M.js";import"./useAnalytics-CopnWV3T.js";const T=y(t=>({value:{marginBottom:t.spacing(.75)},subvalue:{color:t.palette.textSubtle,fontWeight:"normal"}}),{name:"BackstageSubvalueCell"});function v(t){const{value:e,subvalue:s}=t,n=T();return l.jsxs(l.Fragment,{children:[l.jsx(h,{className:n.value,children:e}),l.jsx(h,{className:n.subvalue,children:s})]})}v.__docgenInfo={description:"@deprecated Use `CellText` from `@backstage/ui` in a BUI table instead,\nwith string `title` and `description` props. It renders a complete table\ncell, rather than content for an existing cell. For custom React content,\ncompose BUI `Cell` and `Text` instead.",methods:[],displayName:"SubvalueCell",props:{value:{required:!0,tsType:{name:"ReactNode"},description:""},subvalue:{required:!0,tsType:{name:"ReactNode"},description:""}}};const ze={title:"Data Display/Table",component:a,tags:["!manifest"]},i=y(t=>({container:{width:850},empty:{padding:t.spacing(2),display:"flex",justifyContent:"center"}})),N=(t=10)=>{const e=[];for(;e.length<=t;)e.push({col1:`Some value ${e.length}`,col2:`More data ${e.length}`,subvalue:`Subvalue ${e.length}`,number:Math.round(Math.abs(Math.sin(e.length))*1e3),date:new Date(Math.abs(Math.sin(e.length))*1e13)});return e},o=N(10),r=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:o,columns:e,title:"Backstage Table"})})},c=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:[],columns:e,isLoading:!0,title:"Backstage Table"})})},m=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:[],columns:e,emptyContent:l.jsxs("div",{className:t.empty,children:["No data was added yet, ",l.jsx(C,{to:"http://backstage.io/",children:"learn how to add data"}),"."]}),title:"Backstage Table"})})},u=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:o,columns:e,title:"Backstage Table",subtitle:"Table Subtitle"})})},d=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,search:!1},data:o,columns:e})})},p=()=>{const t=i(),e=[{title:"Column 1",customFilterAndSearch:(s,n)=>`${n.col1} ${n.subvalue}`.toUpperCase().includes(s.toUpperCase()),field:"col1",highlight:!0,render:s=>l.jsx(v,{value:s.col1,subvalue:s.subvalue})},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:o,columns:e})})},g=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,padding:"dense"},data:o,columns:e,title:"Backstage Table"})})},b=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0},{title:"Column 2",field:"col2"},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}],s=[{column:"Column 1",type:"select"},{column:"Column 2",type:"multiple-select"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1,padding:"dense"},data:o,columns:e,filters:s})})},f=()=>{const t=i(),e=[{title:"Column 1",field:"col1",highlight:!0,cellStyle:(s,n)=>n.tableData.id%2===0?{color:"#6CD75F"}:{color:"#DC3D5A"}},{title:"Column 2",field:"col2",cellStyle:{color:"#2FA5DC"}},{title:"Numeric value",field:"number",type:"numeric"},{title:"A Date",field:"date",type:"date"}];return l.jsx("div",{className:t.container,children:l.jsx(a,{options:{paging:!1},data:o,columns:e,title:"Backstage Table"})})};r.__docgenInfo={description:"",methods:[],displayName:"DefaultTable"};c.__docgenInfo={description:"",methods:[],displayName:"LoadingTable"};m.__docgenInfo={description:"",methods:[],displayName:"EmptyTable"};u.__docgenInfo={description:"",methods:[],displayName:"SubtitleTable"};d.__docgenInfo={description:"",methods:[],displayName:"HiddenSearchTable"};p.__docgenInfo={description:"",methods:[],displayName:"SubvalueTable"};g.__docgenInfo={description:"",methods:[],displayName:"DenseTable"};b.__docgenInfo={description:"",methods:[],displayName:"FilterTable"};f.__docgenInfo={description:"",methods:[],displayName:"StyledTable"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
    : any) => \`\${row.col1} \${row.subvalue}\`.toUpperCase().includes(query.toUpperCase()),
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
}`,...f.parameters?.docs?.source}}};const Ge=["DefaultTable","LoadingTable","EmptyTable","SubtitleTable","HiddenSearchTable","SubvalueTable","DenseTable","FilterTable","StyledTable"];export{r as DefaultTable,g as DenseTable,m as EmptyTable,b as FilterTable,d as HiddenSearchTable,c as LoadingTable,f as StyledTable,u as SubtitleTable,p as SubvalueTable,Ge as __namedExportsOrder,ze as default};
