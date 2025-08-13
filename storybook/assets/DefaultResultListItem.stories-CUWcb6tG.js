import{j as e}from"./jsx-runtime-Cw0GR0a5.js";import{i as k}from"./interopRequireDefault-Y9pwbXtE.js";import{r as L,i as H}from"./createSvgIcon-C7DOmWEG.js";import{r as C}from"./index-CTjT7uj6.js";import{d as w}from"./Group-Crf_-LFM.js";import{H as r}from"./DefaultResultListItem-TQLGpq6n.js";import{M as B}from"./index-w6SBqnNd.js";import{S as c}from"./Grid-CFE-uVXf.js";import{L as P}from"./LinkButton-_OE7LV_d.js";import{l as u}from"./themes-iQ1YQB3f.js";import{T as b}from"./ThemeProvider-iV7LyTO2.js";import{C as E}from"./CssBaseline-0XN_ELQr.js";import"./capitalize-BWjKmKKm.js";import"./defaultTheme-DquFOgf8.js";import"./withStyles-DWaS6n8x.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CL6P1I3F.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./index-DwHHXP4W.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./ListItemIcon-CM5i1NWL.js";import"./ListContext-DydK1sOh.js";import"./ListItemText-BQG6-PBZ.js";import"./Typography-D5Gm01bp.js";import"./makeStyles-CRB_T0k9.js";import"./Box-DU2WS7ls.js";import"./typography-1q_m8518.js";import"./useAnalytics-DVyBXs_0.js";import"./ApiRef-CqkoWjZn.js";import"./ConfigApi-D1qiBdfc.js";import"./Link-CpO8OXNj.js";import"./index-Cqve-NHl.js";import"./lodash-CoGan1YB.js";import"./Button-Lmh-1zSr.js";import"./ButtonBase-BGCFQJw7.js";import"./TransitionGroupContext-BtzQ-Cv7.js";import"./palettes-Bwgvserk.js";var l={},q=k,A=H;Object.defineProperty(l,"__esModule",{value:!0});var D=l.default=void 0,M=A(C),N=q(L()),z=(0,N.default)(M.createElement("path",{d:"M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"}),"FindInPage");D=l.default=z;const He={title:"Plugins/Search/DefaultResultListItem",component:r,decorators:[m=>e.jsx(B,{children:e.jsx(c,{container:!0,direction:"row",children:e.jsx(c,{item:!0,xs:12,children:e.jsx(m,{})})})})]},t={location:"search/search-result",title:"Search Result 1",text:"some text from the search result",owner:"some-example-owner"},o=()=>e.jsx(r,{result:t}),s=()=>e.jsx(r,{result:t,icon:e.jsx(D,{color:"primary"})}),i=()=>e.jsx(r,{result:t,secondaryAction:e.jsx(P,{to:"#",size:"small","aria-label":"owner",variant:"text",startIcon:e.jsx(w,{}),style:{textTransform:"lowercase"},children:t.owner})}),a=()=>e.jsx(r,{result:t,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}}),n=()=>{const m={...u,overrides:{...u.overrides,BackstageHighlightedSearchResultText:{highlight:{color:"inherit",backgroundColor:"inherit",fontWeight:"bold",textDecoration:"underline"}}}};return e.jsx(b,{theme:m,children:e.jsx(E,{children:e.jsx(r,{result:t,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}})})})};o.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"WithIcon"};i.__docgenInfo={description:"",methods:[],displayName:"WithSecondaryAction"};a.__docgenInfo={description:"",methods:[],displayName:"WithHighlightedResults"};n.__docgenInfo={description:"",methods:[],displayName:"WithCustomHighlightedResults"};var h,d,p;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} />;
}`,...(p=(d=o.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var g,f,x;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} icon={<FindInPageIcon color="primary" />} />;
}`,...(x=(f=s.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var R,I,S;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} secondaryAction={<LinkButton to="#" size="small" aria-label="owner" variant="text" startIcon={<GroupIcon />} style={{
    textTransform: 'lowercase'
  }}>
          {mockSearchResult.owner}
        </LinkButton>} />;
}`,...(S=(I=i.parameters)==null?void 0:I.docs)==null?void 0:S.source}}};var T,_,v;a.parameters={...a.parameters,docs:{...(T=a.parameters)==null?void 0:T.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} highlight={{
    preTag: '<tag>',
    postTag: '</tag>',
    fields: {
      text: 'some <tag>text</tag> from the search result'
    }
  }} />;
}`,...(v=(_=a.parameters)==null?void 0:_.docs)==null?void 0:v.source}}};var j,y,W;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`() => {
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
}`,...(W=(y=n.parameters)==null?void 0:y.docs)==null?void 0:W.source}}};const Ce=["Default","WithIcon","WithSecondaryAction","WithHighlightedResults","WithCustomHighlightedResults"];export{o as Default,n as WithCustomHighlightedResults,a as WithHighlightedResults,s as WithIcon,i as WithSecondaryAction,Ce as __namedExportsOrder,He as default};
