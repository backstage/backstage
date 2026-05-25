import{aR as I,aS as L,aT as S,aU as j,aE as g,j as t,a2 as D}from"./iframe-C23uhf86.js";import{c as f,D as v}from"./InsertDriveFile-DBVwiWTE.js";import{s as C,M as _}from"./api-aSJcWrTc.js";import{S as o,c as k}from"./SearchResult-CZ2u_Wt-.js";import{L as R}from"./List-CxEdUBo1.js";import{H as n}from"./DefaultResultListItem-nIPKabOE.js";import{a as N}from"./SearchResultList-DwWuMLI5.js";import{w as q}from"./appWrappers-BzBfgp50.js";import{L as w}from"./ListItem-D9IookCZ.js";import{c as E}from"./Plugin-CLtNy0WY.js";import{S as A}from"./SearchContext-Lc5uPF0c.js";import{L as W}from"./Link-BTfSvZWa.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CRGK4bah.js";import"./Add-DzsYPaNd.js";import"./ArrowForwardIos-DQMq3lHN.js";import"./translation-BR7YyGUp.js";import"./useAnalytics-cDq5hBLc.js";import"./Select-C0mIcBan.js";import"./index-B9sM2jn7.js";import"./Popover-TY3wPQ66.js";import"./Modal-Dut4J2Kn.js";import"./Portal-D5gzgC6z.js";import"./formControlState-BH6VChQp.js";import"./MenuItem-DErbDWyg.js";import"./ListSubheader-CpovkBXG.js";import"./Chip-DNArXAr-.js";import"./makeStyles-CpHXwfxK.js";import"./EmptyState-C73jUIsM.js";import"./Grid-B2cP74K4.js";import"./Progress-D-9uawGQ.js";import"./LinearProgress-B5kr522r.js";import"./Box-WThUmTfz.js";import"./styled-CWwxa9HM.js";import"./ResponseErrorPanel-VpMg431Q.js";import"./ErrorPanel-CPQKlaov.js";import"./WarningPanel-HyhysqNj.js";import"./ExpandMore-BXQET-BH.js";import"./AccordionDetails-Fqpb5Vms.js";import"./Collapse-Yf2O74V0.js";import"./MarkdownContent-5Zn4ocUq.js";import"./CodeSnippet-ybNHpEg3.js";import"./CopyTextButton-Xk8JeqLJ.js";import"./useCopyToClipboard-O6QvUuVd.js";import"./useMountedState-CgrANCz4.js";import"./Tooltip-CSFZreiO.js";import"./Popper-ByrnRm1o.js";import"./ListItemText-qN0jgnKe.js";import"./ListContext-Dp4qNsSt.js";import"./Divider-CzSewKKo.js";import"./useAsync-xdfTfIaZ.js";import"./lodash-DUhit4Jc.js";import"./useElementFilter-BK_ImDBR.js";import"./componentData-BZ6And4s.js";import"./ListItemIcon-CPV8s5Dq.js";import"./WebStorage-9ssomDje.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CS6HreOO.js";import"./useIsomorphicLayoutEffect-Dbl_tdyq.js";import"./useApp-BqO9fDba.js";import"./BUIProvider-CudKxgBg.js";import"./openLink-DxqMpht5.js";import"./useResolvedHref-K2vtdLDf.js";import"./useRouteRef-BZu42zxv.js";import"./index-DzKqHxgJ.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},U=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,U]],children:t.jsx(A,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const te=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{a as Default,c as GroupLayout,l as ListLayout,d as UsingSearchResultItemExtensions,p as WithCustomNoResultsComponent,m as WithQuery,te as __namedExportsOrder,$t as default};
