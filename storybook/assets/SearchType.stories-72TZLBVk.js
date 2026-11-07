import{aV as h,aW as y,aX as T,aY as x,aM as S,j as e,P as V,a3 as _}from"./iframe-psIK5yLO.js";import{M as j}from"./MenuBook-D1LVcX5r.js";import{S as u}from"./SearchType-BWAyRIGM.js";import{s as g,M as P}from"./api-BvqLUifP.js";import{S as R}from"./SearchContext-AePd5d4c.js";import{S as m}from"./Grid-CMGT3-M2.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-C7UmlSI-.js";import"./useAsync-mn43h2uI.js";import"./useMountedState-JsdGtBh8.js";import"./translation-B_ztHmiZ.js";import"./Box-R-XiqEG_.js";import"./styled-Bxm6pxZC.js";import"./AccordionDetails-CqQf_glR.js";import"./index-B9sM2jn7.js";import"./Collapse-8SCsonqF.js";import"./List-CsoDoiW7.js";import"./ListContext-CW1RYZn6.js";import"./Divider-7jYIyKh_.js";import"./ListItem-CUlz7EaG.js";import"./ListItemIcon-Dv-jhMIX.js";import"./ListItemText-Ohlq3yEc.js";import"./makeStyles-BO5raylp.js";import"./Tabs-BgVXlz_s.js";import"./KeyboardArrowRight-CEtOZUvU.js";import"./FormLabel-BK9cApn1.js";import"./formControlState-CetD2ofI.js";import"./InputLabel-BTJYNW0s.js";import"./Select-CzIHTpTv.js";import"./Popover-n6BkYlst.js";import"./Modal-Cb0YJWzm.js";import"./Portal-DepeXD6C.js";import"./MenuItem-CYMgLI3C.js";import"./Checkbox-DmH8ZdLu.js";import"./SwitchBase-TBiHszpn.js";import"./Chip-B0x_3DfR.js";import"./useAnalytics-DunOMgS-.js";import"./lodash-DavWhvf8.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(_,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(V,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
