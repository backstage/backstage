import{aA as T,f as S,aB as d,aC as v,p as I,ah as j,ai as _,aj as y,ak as k,q as D,j as e,a0 as W}from"./iframe-B6vHPHUS.js";import{G as C}from"./Group-D5nDcCMn.js";import{H as s}from"./DefaultResultListItem-6pzAzgb2.js";import{M as L}from"./index-CG8HQpK_.js";import{S as g}from"./Grid-BHnfM9BN.js";import{L as P}from"./LinkButton-DwUDlPmx.js";import{C as H}from"./CssBaseline-C87Va_K5.js";import"./preload-helper-D9Z9MdNV.js";import"./ListItemIcon-BFkyMXV-.js";import"./ListContext-D8DpMZfT.js";import"./ListItemText-BE9Uflaf.js";import"./Box-BsuLuKk6.js";import"./styled-BNzka1pC.js";import"./useAnalytics-CHRs9F0l.js";import"./Link-BCwjV0MZ.js";import"./lodash-CwBbdt2Q.js";import"./useApp-c9Cmx9JK.js";import"./Button-CJpRzj7y.js";function q(t){return{props:{MuiGrid:d?.MuiGrid?.defaultProps,MuiSwitch:d?.MuiSwitch?.defaultProps},...S(t)}}function w(t){return v(t,d).overrides}function R(t){const m=q(t),u=T(m),h=w(u);return{...u,overrides:h}}const f=R({palette:I.light});R({palette:I.dark});var o={},x;function B(){if(x)return o;x=1;var t=j(),m=_();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var u=m(y()),h=t(k()),p=(0,h.default)(u.createElement("path",{d:"M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"}),"FindInPage");return o.default=p,o}var M=B();const b=D(M),re={title:"Plugins/Search/DefaultResultListItem",component:s,decorators:[t=>e.jsx(L,{children:e.jsx(g,{container:!0,direction:"row",children:e.jsx(g,{item:!0,xs:12,children:e.jsx(t,{})})})})]},r={location:"search/search-result",title:"Search Result 1",text:"some text from the search result",owner:"some-example-owner"},a=()=>e.jsx(s,{result:r}),i=()=>e.jsx(s,{result:r,icon:e.jsx(b,{color:"primary"})}),n=()=>e.jsx(s,{result:r,secondaryAction:e.jsx(P,{to:"#",size:"small","aria-label":"owner",variant:"text",startIcon:e.jsx(C,{}),style:{textTransform:"lowercase"},children:r.owner})}),c=()=>e.jsx(s,{result:r,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}}),l=()=>{const t={...f,overrides:{...f.overrides,BackstageHighlightedSearchResultText:{highlight:{color:"inherit",backgroundColor:"inherit",fontWeight:"bold",textDecoration:"underline"}}}};return e.jsx(W,{theme:t,children:e.jsx(H,{children:e.jsx(s,{result:r,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}})})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"WithIcon"};n.__docgenInfo={description:"",methods:[],displayName:"WithSecondaryAction"};c.__docgenInfo={description:"",methods:[],displayName:"WithHighlightedResults"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomHighlightedResults"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} />;
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} icon={<FindInPageIcon color="primary" />} />;
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
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
}`,...l.parameters?.docs?.source}}};const se=["Default","WithIcon","WithSecondaryAction","WithHighlightedResults","WithCustomHighlightedResults"];export{a as Default,l as WithCustomHighlightedResults,c as WithHighlightedResults,i as WithIcon,n as WithSecondaryAction,se as __namedExportsOrder,re as default};
