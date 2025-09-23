import{aA as T,f as S,aB as d,aC as v,p as I,ag as j,ah as _,ai as y,aj as D,s as W,j as e,a1 as k,aD as L}from"./iframe-Ca7Z-L4G.js";import{G as P}from"./Group-o8cghnGx.js";import{H as s}from"./DefaultResultListItem-CcVWFdUM.js";import{M as C}from"./index-BJKCiffA.js";import{S as p}from"./Grid-auHuq8r2.js";import{L as H}from"./LinkButton-BKXHaC2U.js";import"./preload-helper-D9Z9MdNV.js";import"./ListItemIcon-BNgxXteL.js";import"./ListContext-B_Im9Dn6.js";import"./ListItemText-DZSn-Gas.js";import"./Box-BAIj98gt.js";import"./styled-C18e2gIS.js";import"./useAnalytics-B4tVP_DV.js";import"./Link-D6f9g5gT.js";import"./lodash-CwBbdt2Q.js";import"./useApp-CAw2wdK9.js";import"./Button-C4GDJaSU.js";function w(t){return{props:{MuiGrid:d?.MuiGrid?.defaultProps,MuiSwitch:d?.MuiSwitch?.defaultProps},...S(t)}}function q(t){return v(t,d).overrides}function R(t){const m=w(t),u=T(m),h=q(u);return{...u,overrides:h}}const f=R({palette:I.light});R({palette:I.dark});var o={},x;function B(){if(x)return o;x=1;var t=j(),m=_();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var u=m(y()),h=t(D()),g=(0,h.default)(u.createElement("path",{d:"M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"}),"FindInPage");return o.default=g,o}var M=B();const b=W(M),te={title:"Plugins/Search/DefaultResultListItem",component:s,decorators:[t=>e.jsx(C,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(t,{})})})})]},r={location:"search/search-result",title:"Search Result 1",text:"some text from the search result",owner:"some-example-owner"},a=()=>e.jsx(s,{result:r}),i=()=>e.jsx(s,{result:r,icon:e.jsx(b,{color:"primary"})}),n=()=>e.jsx(s,{result:r,secondaryAction:e.jsx(H,{to:"#",size:"small","aria-label":"owner",variant:"text",startIcon:e.jsx(P,{}),style:{textTransform:"lowercase"},children:r.owner})}),c=()=>e.jsx(s,{result:r,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}}),l=()=>{const t={...f,overrides:{...f.overrides,BackstageHighlightedSearchResultText:{highlight:{color:"inherit",backgroundColor:"inherit",fontWeight:"bold",textDecoration:"underline"}}}};return e.jsx(k,{theme:t,children:e.jsx(L,{children:e.jsx(s,{result:r,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}})})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"WithIcon"};n.__docgenInfo={description:"",methods:[],displayName:"WithSecondaryAction"};c.__docgenInfo={description:"",methods:[],displayName:"WithHighlightedResults"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomHighlightedResults"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...l.parameters?.docs?.source}}};const re=["Default","WithIcon","WithSecondaryAction","WithHighlightedResults","WithCustomHighlightedResults"];export{a as Default,l as WithCustomHighlightedResults,c as WithHighlightedResults,i as WithIcon,n as WithSecondaryAction,re as __namedExportsOrder,te as default};
