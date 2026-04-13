import{aN as I,aO as L,aP as S,aQ as j,aD as g,j as t,$ as D}from"./iframe-Pg_F-I9L.js";import{c as f,D as v}from"./InsertDriveFile-CSjkZvoS.js";import{s as C,M as _}from"./api-BSlZFPqe.js";import{S as o,c as N}from"./SearchResult-BiAGvI5q.js";import{L as R}from"./List-6IhIysu1.js";import{H as n}from"./DefaultResultListItem-DCWPOu5O.js";import{a as k}from"./SearchResultList-Q7YNd0dx.js";import{w as q}from"./appWrappers-DSIoTw2r.js";import{L as w}from"./ListItem-2g96ETpe.js";import{c as A}from"./Plugin-D35To3G5.js";import{S as E}from"./SearchContext-DSiWpP7g.js";import{L as W}from"./Link-CtDLnTRC.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BTBUaq3i.js";import"./Add-Bq1_Fe3y.js";import"./ArrowForwardIos-CuwElbhc.js";import"./translation-DVahjL1f.js";import"./useAnalytics-DLzqrBGl.js";import"./Select-BLK8dCJ1.js";import"./index-B9sM2jn7.js";import"./Popover-Ct-qR0uU.js";import"./Modal-eVB76OKV.js";import"./Portal-CkW81tAw.js";import"./formControlState-BQU6yhH1.js";import"./MenuItem-CPr62g3a.js";import"./ListSubheader-CiZSEHAe.js";import"./Chip-iwlGDFdd.js";import"./makeStyles-Cbx_09Po.js";import"./EmptyState-DRvcZZb8.js";import"./Grid-B2ie39ah.js";import"./Progress-BNbkxzzs.js";import"./LinearProgress-_nZ_54T8.js";import"./Box-203OJvOv.js";import"./styled-CAdW7jEY.js";import"./ResponseErrorPanel-DPjPqs_A.js";import"./ErrorPanel-DbzJVEOG.js";import"./WarningPanel-16oLvM6D.js";import"./ExpandMore-BaxmueBk.js";import"./AccordionDetails-BeAGU05y.js";import"./Collapse-C4uiH6iK.js";import"./MarkdownContent-33uXacfS.js";import"./CodeSnippet-B8fu7jLM.js";import"./CopyTextButton-DGA1dmmr.js";import"./useCopyToClipboard-B9rynQkB.js";import"./useMountedState-D6eLrfLV.js";import"./Tooltip-CpdE-o-J.js";import"./Popper-CaJ2KdJo.js";import"./ListItemText-Si6zf9CU.js";import"./ListContext-CwmeD3xv.js";import"./Divider-BhBPAqRx.js";import"./useAsync-CW2Au6KB.js";import"./lodash-B6WwamON.js";import"./useElementFilter-BXBR35x1.js";import"./componentData-Wy1DYnF8.js";import"./ListItemIcon-DDBrXLM0.js";import"./WebStorage-DxodPYxM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-FonloEUf.js";import"./useIsomorphicLayoutEffect-BP1NgAsv.js";import"./useApp-Dqd5lgHs.js";import"./BUIProvider-Bui5puU7.js";import"./openLink-CHCvyqBl.js";import"./useRouteRef-Dn3cSQUO.js";import"./index-M3sqaKV4.js";var i={},y;function P(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var G=P();const H=g(G),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},O=new _(M),Yt={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,O]],children:t.jsx(E,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(k,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(H,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=A({id:"plugin"}).provide(N({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const Zt=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{a as Default,c as GroupLayout,l as ListLayout,d as UsingSearchResultItemExtensions,p as WithCustomNoResultsComponent,m as WithQuery,Zt as __namedExportsOrder,Yt as default};
