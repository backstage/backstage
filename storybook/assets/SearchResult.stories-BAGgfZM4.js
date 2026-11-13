import{aJ as I,aK as L,aL as S,aM as j,aC as g,j as t,X as D}from"./iframe-a5iorYt_.js";import{c as f,D as v}from"./InsertDriveFile-D6dlHKOt.js";import{s as C,M as _}from"./api-BkLfedZG.js";import{S as o,c as k}from"./SearchResult-ea__zZYU.js";import{L as R}from"./List-DC5vfnmZ.js";import{H as n}from"./DefaultResultListItem-BQUhFKHx.js";import{a as N}from"./SearchResultList-BG8g7BLz.js";import{w as q}from"./appWrappers-DS30rzTn.js";import{L as w}from"./ListItem-C_oFpBsa.js";import{c as A}from"./Plugin-D9FjVq-H.js";import{S as E}from"./SearchContext-DQUl4_YI.js";import{L as W}from"./Link-CkwOc38T.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BZe0qFmg.js";import"./Add-DJ_ArsHj.js";import"./ArrowForwardIos-B4_LPFli.js";import"./translation-CuZyM59u.js";import"./useAnalytics-DCNn34Rq.js";import"./Select-ziOJ0VU_.js";import"./index-B9sM2jn7.js";import"./Popover-B-goAEQ-.js";import"./Modal-CuivDZiA.js";import"./Portal-CHBw253U.js";import"./formControlState-BssZVbvL.js";import"./MenuItem-D_C0q48i.js";import"./ListSubheader-DbP8ffaL.js";import"./Chip-BPhEj-hh.js";import"./makeStyles-C3e0W14-.js";import"./EmptyState-2VsQADQe.js";import"./Grid-GKprjDXV.js";import"./Progress-mcoMQIul.js";import"./LinearProgress-D3Cct-wL.js";import"./Box-BeM7E2iG.js";import"./styled-D8mefoHX.js";import"./ResponseErrorPanel-DJSyaEat.js";import"./ErrorPanel-DCIylhjP.js";import"./WarningPanel-dTLQC0wO.js";import"./ExpandMore-C4_a14Ka.js";import"./AccordionDetails-Di5rumEH.js";import"./Collapse-ex4-Upv2.js";import"./MarkdownContent-sAOjAFni.js";import"./ListItemText-DPcnvc1K.js";import"./ListContext-Dj5C0Bx_.js";import"./CopyTextButton-CGf0YRCN.js";import"./useCopyToClipboard-DGLK9DJc.js";import"./useMountedState-BQtZDAQ3.js";import"./Tooltip-Dhxyt2Bc.js";import"./useObjectRef-DomNprMl.js";import"./useOverlayTriggerState-oc_4bf5x.js";import"./utils-CKuAz2Wi.js";import"./useFocusRing-BW-GobYG.js";import"./number-Ccp2yLIm.js";import"./I18nProvider-Cha0UYwj.js";import"./useControlledState-x1Vpl6eH.js";import"./animation-CocdaLDQ.js";import"./useHover-D7-ycX7p.js";import"./ButtonIcon-CXYdBlUn.js";import"./Button-DH0afYUU.js";import"./Label-Orfe5toA.js";import"./Hidden-Bu-9bwhW.js";import"./useLabel-Bgchr9R9.js";import"./useLabels-BoVBLTQ5.js";import"./useButton-6YfvAB0s.js";import"./usePress-BUjc0uWv.js";import"./textSelection-C8mzHD_X.js";import"./getMetaValue-BDmRRgum.js";import"./index-DmAgGD7M.js";import"./Divider-DGoABXJT.js";import"./CodeSnippet-Dz_bEVXA.js";import"./useAsync-CxmaK9zZ.js";import"./lodash-Ba724kq_.js";import"./useElementFilter-DaZ59J0i.js";import"./componentData-CiQPq3BR.js";import"./ListItemIcon-zcWHzz5p.js";import"./WebStorage-CrYb5zEE.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CIXpXNvI.js";import"./useObservable-CKU1UQ6z.js";import"./useIsomorphicLayoutEffect-BI45JR--.js";import"./useApp-Ch2_fjtz.js";import"./BUIProvider-CnPnbG6C.js";import"./useRouteRef-C0wkGfeM.js";import"./index-B19-WIzK.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const M=g(H),P={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},z=new _(P),ye={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,z]],children:t.jsx(E,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},m=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),a=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(M,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=A({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};m.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...m.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  const query = {
    term: 'documentation'
  };
  return <SearchResult query={query}>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <SearchResultListLayout resultItems={results} renderResultItem={({
      type,
      document
    }) => {
      switch (type) {
        case 'custom-result-item':
          return <CustomResultListItem key={document.location} result={document} />;
        default:
          return <DefaultResultListItem key={document.location} result={document} />;
      }
    }} />}
    </SearchResult>;
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <>
          <SearchResultGroupLayout icon={<CustomIcon />} title="Custom" link="See all custom results" resultItems={results.filter(({
        type
      }) => type === 'custom-result-item')} renderResultItem={({
        document
      }) => <CustomResultListItem key={document.location} result={document} />} />
          <SearchResultGroupLayout icon={<DefaultIcon />} title="Default" resultItems={results.filter(({
        type
      }) => type !== 'custom-result-item')} renderResultItem={({
        document
      }) => <DefaultResultListItem key={document.location} result={document} />} />
        </>}
    </SearchResult>;
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult noResultsComponent={<>No results were found</>}>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultResultItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResult>
      <DefaultResultItem />
    </SearchResult>;
}`,...d.parameters?.docs?.source}}};const xe=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{m as Default,c as GroupLayout,l as ListLayout,d as UsingSearchResultItemExtensions,p as WithCustomNoResultsComponent,a as WithQuery,xe as __namedExportsOrder,ye as default};
