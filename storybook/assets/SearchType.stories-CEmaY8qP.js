import{j as e}from"./jsx-runtime-hv06LKfz.js";import{C as v}from"./MenuBook-CmInnpB5.js";import{b as f,g as h}from"./index-D8-PC79C.js";import{r as T,a as y,b as x}from"./createSvgIcon-968fIvf3.js";import{U as S}from"./Person-C4Ifh5Qq.js";import{S as i}from"./SearchType-BUDM-mNq.js";import{s as V,M as j}from"./api-YILTVPsk.js";import{S as g}from"./SearchContext-DiK7zrkk.js";import{S as m}from"./Grid-B5_CkpxN.js";import{P as _}from"./Paper-g-2P_2fo.js";import{T as D}from"./TestApiProvider-DCQwDAHh.js";import"./capitalize-Cx0lXINv.js";import"./defaultTheme-BZ7Q3aB1.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-Bqo-niQy.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./ExpandMore-CjC13_XR.js";import"./useAsync-7M-9CJJS.js";import"./useMountedState-YD35FCBK.js";import"./translation-CeN2fIBA.js";import"./TranslationApi-CV0OlCW4.js";import"./ApiRef-ByCJBjX1.js";import"./makeStyles-DNGcMHuZ.js";import"./Box-Cdmuh-oH.js";import"./typography-Bv5XhOtM.js";import"./Typography-BvnmTcFn.js";import"./AccordionDetails-MA8ABENV.js";import"./toArray-DBEVWI-m.js";import"./index-DnL3XN75.js";import"./Collapse-DypQNfvv.js";import"./utils--Do46zhV.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./useTheme-CwtcVVC7.js";import"./ButtonBase-C97Mu9vz.js";import"./IconButton-Bo_KmUI8.js";import"./List-BRD79VOL.js";import"./ListContext-Brz5ktZ2.js";import"./Divider-tNHB8jev.js";import"./ListItem-1Gp_c_kg.js";import"./ListItemIcon-CPGNcdIP.js";import"./ListItemText-hnjP-Wi1.js";import"./useTranslationRef-DKy5gnX5.js";import"./Tabs-BI6NbQTI.js";import"./KeyboardArrowRight-CL3cFyuk.js";import"./FormLabel-DJnitPz3.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Dd17crCt.js";import"./InputLabel-BiMWBgfE.js";import"./Select-D9JUzshQ.js";import"./Popover-Bgi2_Td5.js";import"./Grow-CJaQTCqR.js";import"./Modal-Bc9WJ84x.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-yuzZovYw.js";import"./MenuItem-DBFxhKJV.js";import"./Checkbox-bPQmbo2P.js";import"./SwitchBase-CrrTsKlx.js";import"./Chip-BPuC1qUR.js";import"./lodash-D1GzKnrP.js";import"./ConfigApi-ij0WO1-Y.js";import"./useAnalytics-Q-nz63z2.js";import"./ApiProvider-CYh4HGR1.js";import"./index-BKN9BsH4.js";var r={},s;function I(){if(s)return r;s=1;var p=T(),n=y();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var l=n(f()),c=p(x()),d=(0,c.default)(l.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=h(R),Be={title:"Plugins/Search/SearchType",component:i,decorators:[p=>e.jsx(D,{apis:[[V,new j]],children:e.jsx(g,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(p,{})})})})})]},u=["value-1","value-2","value-3"],o=()=>e.jsx(_,{style:{padding:10},children:e.jsx(i,{name:"Search type",values:u,defaultValue:u[0]})}),a=()=>e.jsx(i.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(v,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(S,{})}]}),t=()=>e.jsx(i.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});o.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const Je=["Default","Accordion","Tabs"];export{a as Accordion,o as Default,t as Tabs,Je as __namedExportsOrder,Be as default};
