import{ah as I,ai as L,aj as S,ak as j,a3 as g,j as t,T as D}from"./iframe-DpqnIERb.js";import{c as f,D as v}from"./InsertDriveFile-BuPE6xm3.js";import{s as C,M as _}from"./api-lgE5jH2i.js";import{a as o,c as k}from"./SearchResult-C5AWBCaz.js";import{S as N}from"./SearchContext-CPmiQTPj.js";import{L as R}from"./List-CZbmWexd.js";import{H as n}from"./DefaultResultListItem-CYBFvHnd.js";import{a as q}from"./SearchResultList-Brrt8xqq.js";import{L as w}from"./ListItem-D0Z8ElGo.js";import{w as A}from"./appWrappers-DtX5QIpn.js";import{c as E}from"./Plugin-BwzRXZkr.js";import{L as W}from"./Link-CYlpUQKG.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CzHsSl9-.js";import"./Add-PriOR8Al.js";import"./ArrowForwardIos-BjFVdURK.js";import"./translation-BJBR4TYC.js";import"./MenuItem-DwVoi_KI.js";import"./ListSubheader-wbBTBpOo.js";import"./Chip-BUDV__U1.js";import"./Select-DlqTSxMB.js";import"./index-B9sM2jn7.js";import"./Popover-cJal3ZUL.js";import"./Modal-DsN87qYK.js";import"./Portal-BmmQaE8x.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BXtaIVU6.js";import"./useAnalytics-DvwM4ONZ.js";import"./EmptyState-QyceDM6T.js";import"./Grid-ByES49Fm.js";import"./Progress-BAPOf5dV.js";import"./LinearProgress-O1OsW5QD.js";import"./Box-B2dMzSz4.js";import"./styled-iMmr_MI_.js";import"./ResponseErrorPanel-4tNBZqk5.js";import"./ErrorPanel-9MxiIPAH.js";import"./WarningPanel-4qyRcOUk.js";import"./ExpandMore-BgvB3-yb.js";import"./AccordionDetails-Bu4VHsDj.js";import"./Collapse-BXZ4KKDG.js";import"./MarkdownContent-C_B0rjEe.js";import"./CodeSnippet-BZN7CHRt.js";import"./CopyTextButton-BZ1rpe7z.js";import"./useCopyToClipboard-DxpZSgA2.js";import"./useMountedState-5johZ_Rp.js";import"./Tooltip-BVf39uWy.js";import"./Popper-DbBOQ0oU.js";import"./ListItemText-DoVLQ6VK.js";import"./ListContext-BxawfRoI.js";import"./Divider-BjLL1Xub.js";import"./useAsync-DJIduLQY.js";import"./lodash-Y_-RFQgK.js";import"./useElementFilter-C3Uuu8LE.js";import"./componentData-Bjp7AxYA.js";import"./ListItemIcon-DJynWx8H.js";import"./useObservable-BoxxXUWC.js";import"./useIsomorphicLayoutEffect-7TzPryCL.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DoyRYStT.js";import"./useApp-BzWSwMGn.js";import"./useRouteRef-Do6k1rAi.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},z=new _(M),Kt={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>A(t.jsx(D,{apis:[[C,z]],children:t.jsx(N,{children:t.jsx(s,{})})}))]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>{switch(e){case"custom-result-item":return t.jsx(h,{result:r},r.location);default:return t.jsx(n,{result:r},r.location)}})})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>{switch(r){case"custom-result-item":return t.jsx(h,{result:u},u.location);default:return t.jsx(n,{result:u},u.location)}})})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(q,{resultItems:s,renderResultItem:({type:e,document:r})=>{switch(e){case"custom-result-item":return t.jsx(h,{result:r},r.location);default:return t.jsx(n,{result:r},r.location)}}})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>{switch(e){case"custom-result-item":return t.jsx(h,{result:r},r.location);default:return t.jsx(n,{result:r},r.location)}})})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
