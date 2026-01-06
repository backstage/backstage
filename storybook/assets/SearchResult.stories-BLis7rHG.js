import{aC as I,aD as L,aE as S,aF as j,a4 as g,j as t,T as D}from"./iframe-DgkzaRcz.js";import{c as f,D as v}from"./InsertDriveFile-oh912q4x.js";import{s as C,M as _}from"./api-BJ3-p9vs.js";import{a as o,c as k}from"./SearchResult-CD0z4aSJ.js";import{S as N}from"./SearchContext-DGF8OHr8.js";import{L as R}from"./List-UtDCRpiD.js";import{H as n}from"./DefaultResultListItem-COLvKpXH.js";import{a as q}from"./SearchResultList-Byqc2Rvf.js";import{L as w}from"./ListItem-D-dCGJEh.js";import{w as E}from"./appWrappers-BBkmPso_.js";import{c as A}from"./Plugin-Dd63G45J.js";import{L as W}from"./Link-CD76Rbm5.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BH7N7lqx.js";import"./Add-Dv9DYIF4.js";import"./ArrowForwardIos-CFHaTKih.js";import"./translation-BoH2AF-k.js";import"./MenuItem-XzAP9_v_.js";import"./ListSubheader-CYQqV7n-.js";import"./Chip-DQW-kikY.js";import"./Select-BnN-ghVl.js";import"./index-B9sM2jn7.js";import"./Popover-BOhX_6l5.js";import"./Modal-BMl9YgIm.js";import"./Portal-DiyW3rHr.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Cha8QXy2.js";import"./useAnalytics-qnTiS8hb.js";import"./EmptyState-CQN_OyOL.js";import"./Grid-13HvIHxd.js";import"./Progress-DHKAo1e3.js";import"./LinearProgress-CH1xl8Ne.js";import"./Box-CjF3f9rs.js";import"./styled-TNDgSIeW.js";import"./ResponseErrorPanel-CYjr1St8.js";import"./ErrorPanel-DxGQ0b0O.js";import"./WarningPanel-CQQNTNrV.js";import"./ExpandMore-Dxz0ockR.js";import"./AccordionDetails-FigVUmDd.js";import"./Collapse-zjOOSLQm.js";import"./MarkdownContent-B2WHC1-q.js";import"./CodeSnippet-qrWrlZ1D.js";import"./CopyTextButton-BPmF_Ha2.js";import"./useCopyToClipboard-CcmaW2E0.js";import"./useMountedState-C4ChfPSk.js";import"./Tooltip-eP5YooZ3.js";import"./Popper-D8NH0TjN.js";import"./ListItemText-BTjp8q3D.js";import"./ListContext-Bc5vGjYI.js";import"./Divider-BsgTAdRC.js";import"./useAsync-B6sI7pgh.js";import"./lodash-Y_-RFQgK.js";import"./useElementFilter-DR2X3iet.js";import"./componentData-D6jwBdZo.js";import"./ListItemIcon-DgBckAZa.js";import"./useObservable-UgjFkqx9.js";import"./useIsomorphicLayoutEffect-PH24tZgE.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BovWTFKo.js";import"./useApp-Dd6zMmOH.js";import"./useRouteRef-CgaN9BS2.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},F=new _(M),Kt={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>E(t.jsx(D,{apis:[[C,F]],children:t.jsx(N,{children:t.jsx(s,{})})}))]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>{switch(e){case"custom-result-item":return t.jsx(h,{result:r},r.location);default:return t.jsx(n,{result:r},r.location)}})})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>{switch(r){case"custom-result-item":return t.jsx(h,{result:u},u.location);default:return t.jsx(n,{result:u},u.location)}})})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(q,{resultItems:s,renderResultItem:({type:e,document:r})=>{switch(e){case"custom-result-item":return t.jsx(h,{result:r},r.location);default:return t.jsx(n,{result:r},r.location)}}})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>{switch(e){case"custom-result-item":return t.jsx(h,{result:r},r.location);default:return t.jsx(n,{result:r},r.location)}})})}),d=()=>{const e=A({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...a.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...m.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const Xt=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{a as Default,c as GroupLayout,l as ListLayout,d as UsingSearchResultItemExtensions,p as WithCustomNoResultsComponent,m as WithQuery,Xt as __namedExportsOrder,Kt as default};
