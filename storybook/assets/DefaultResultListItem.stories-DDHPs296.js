import{j as e}from"./jsx-runtime-hv06LKfz.js";import{b as T,g as S}from"./index-D8-PC79C.js";import{r as v,a as _,b as j}from"./createSvgIcon-968fIvf3.js";import{G as y}from"./Group-CCSiUWMf.js";import{H as o}from"./DefaultResultListItem-B3YeUYeX.js";import{M as D}from"./index-B7KODvs-.js";import{S as g}from"./Grid-B5_CkpxN.js";import{L as W}from"./LinkButton-BQ_gU9WM.js";import{c as k,d,t as L,p as I}from"./palettes-EuACyB3O.js";import{B as P}from"./defaultTheme-BZ7Q3aB1.js";import{T as C}from"./ThemeProvider-C3WTbj0u.js";import{C as H}from"./CssBaseline-CAdWyNck.js";import"./capitalize-Cx0lXINv.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-Bqo-niQy.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./ListItemIcon-CPGNcdIP.js";import"./ListContext-Brz5ktZ2.js";import"./ListItemText-hnjP-Wi1.js";import"./Typography-BvnmTcFn.js";import"./makeStyles-DNGcMHuZ.js";import"./Box-Cdmuh-oH.js";import"./typography-Bv5XhOtM.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./ApiRef-ByCJBjX1.js";import"./Link-DATBiw5a.js";import"./index-DlxYA1zJ.js";import"./lodash-D1GzKnrP.js";import"./useApp-BOX1l_wP.js";import"./Button-CEmE9XRa.js";import"./ButtonBase-C97Mu9vz.js";import"./TransitionGroupContext-CcnbR2YJ.js";function w(t){return{props:{MuiGrid:d?.MuiGrid?.defaultProps,MuiSwitch:d?.MuiSwitch?.defaultProps},...k(t)}}function b(t){return L(t,d).overrides}function R(t){const u=w(t),l=P(u),h=b(l);return{...l,overrides:h}}const f=R({palette:I.light});R({palette:I.dark});var s={},x;function q(){if(x)return s;x=1;var t=v(),u=_();Object.defineProperty(s,"__esModule",{value:!0}),s.default=void 0;var l=u(T()),h=t(j()),p=(0,h.default)(l.createElement("path",{d:"M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"}),"FindInPage");return s.default=p,s}var B=q();const M=S(B),ye={title:"Plugins/Search/DefaultResultListItem",component:o,decorators:[t=>e.jsx(D,{children:e.jsx(g,{container:!0,direction:"row",children:e.jsx(g,{item:!0,xs:12,children:e.jsx(t,{})})})})]},r={location:"search/search-result",title:"Search Result 1",text:"some text from the search result",owner:"some-example-owner"},i=()=>e.jsx(o,{result:r}),a=()=>e.jsx(o,{result:r,icon:e.jsx(M,{color:"primary"})}),n=()=>e.jsx(o,{result:r,secondaryAction:e.jsx(W,{to:"#",size:"small","aria-label":"owner",variant:"text",startIcon:e.jsx(y,{}),style:{textTransform:"lowercase"},children:r.owner})}),c=()=>e.jsx(o,{result:r,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}}),m=()=>{const t={...f,overrides:{...f.overrides,BackstageHighlightedSearchResultText:{highlight:{color:"inherit",backgroundColor:"inherit",fontWeight:"bold",textDecoration:"underline"}}}};return e.jsx(C,{theme:t,children:e.jsx(H,{children:e.jsx(o,{result:r,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}})})})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithIcon"};n.__docgenInfo={description:"",methods:[],displayName:"WithSecondaryAction"};c.__docgenInfo={description:"",methods:[],displayName:"WithHighlightedResults"};m.__docgenInfo={description:"",methods:[],displayName:"WithCustomHighlightedResults"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} />;
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} icon={<FindInPageIcon color="primary" />} />;
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} secondaryAction={<LinkButton to="#" size="small" aria-label="owner" variant="text" startIcon={<GroupIcon />} style={{
    textTransform: 'lowercase'
  }}>
          {mockSearchResult.owner}
        </LinkButton>} />;
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} highlight={{
    preTag: '<tag>',
    postTag: '</tag>',
    fields: {
      text: 'some <tag>text</tag> from the search result'
    }
  }} />;
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const customTheme = {
    ...lightTheme,
    overrides: {
      ...lightTheme.overrides,
      BackstageHighlightedSearchResultText: {
        highlight: {
          color: 'inherit',
          backgroundColor: 'inherit',
          fontWeight: 'bold',
          textDecoration: 'underline'
        }
      }
    }
  };
  return <ThemeProvider theme={customTheme}>
      <CssBaseline>
        <DefaultResultListItem result={mockSearchResult} highlight={{
        preTag: '<tag>',
        postTag: '</tag>',
        fields: {
          text: 'some <tag>text</tag> from the search result'
        }
      }} />
      </CssBaseline>
    </ThemeProvider>;
}`,...m.parameters?.docs?.source}}};const De=["Default","WithIcon","WithSecondaryAction","WithHighlightedResults","WithCustomHighlightedResults"];export{i as Default,m as WithCustomHighlightedResults,c as WithHighlightedResults,a as WithIcon,n as WithSecondaryAction,De as __namedExportsOrder,ye as default};
