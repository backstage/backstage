import{aW as h,aX as y,aY as T,aZ as x,aN as S,j as e,P as _,a3 as V}from"./iframe-D5t0zV2Z.js";import{M as j}from"./MenuBook-CSkSfB82.js";import{S as u}from"./SearchType-D6iiOzfu.js";import{s as g,M as P}from"./api-D9Y4gEUt.js";import{S as R}from"./SearchContext-CrkfKUOO.js";import{S as m}from"./Grid-i35IH7WF.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-Cysl7Wnp.js";import"./useAsync-OcUXg1oi.js";import"./useMountedState-CfWlui47.js";import"./translation-BbLcgEx4.js";import"./Box-DF_678xD.js";import"./styled-J0WIBf2g.js";import"./AccordionDetails-B_jQxHeL.js";import"./index-B9sM2jn7.js";import"./Collapse-CVJ-cdWY.js";import"./List-Ce0b0pZR.js";import"./ListContext-_YXk3x9k.js";import"./Divider-DjHAkBtb.js";import"./ListItem-_yy6hJX-.js";import"./ListItemIcon-D-0E4dQz.js";import"./ListItemText-C0xxtZwN.js";import"./makeStyles-C7L4K4uU.js";import"./Tabs-CrTtasnL.js";import"./KeyboardArrowRight-CJ5vtzdw.js";import"./FormLabel-CQa9egpo.js";import"./formControlState-44ZmUZgp.js";import"./InputLabel-DzxKevsK.js";import"./Select-C32RWvvM.js";import"./Popover-CUv6Uz21.js";import"./Modal-DcpDkvWp.js";import"./Portal-B-PE47rq.js";import"./MenuItem-oAdMpMYN.js";import"./Checkbox-D6FmwpjL.js";import"./SwitchBase-CgfgxhFq.js";import"./Chip-BqtPDnwS.js";import"./useAnalytics-BxfmAkrD.js";import"./lodash-DUCm7Gp4.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  return <SearchType.Accordion name="Result Types" defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One',
    icon: <CatalogIcon />
  }, {
    value: 'value-2',
    name: 'Value Two',
    icon: <DocsIcon />
  }, {
    value: 'value-3',
    name: 'Value Three',
    icon: <UsersGroupsIcon />
  }]} />;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchType.Tabs defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One'
  }, {
    value: 'value-2',
    name: 'Value Two'
  }, {
    value: 'value-3',
    name: 'Value Three'
  }]} />;
}`,...s.parameters?.docs?.source}}};const Te=["Default","Accordion","Tabs"];export{i as Accordion,t as Default,s as Tabs,Te as __namedExportsOrder,ye as default};
