import{cf as I,cg as L,cj as S,ce as j,bu as g,bR as t,a5 as D}from"./iframe-D-U3XCi_.js";import{a as f,D as v}from"./InsertDriveFile-DvOfBTJK.js";import{s as C,M as _}from"./api-DV1kXobU.js";import{S as o,c as k}from"./SearchResult-DVXaGbeB.js";import{L as R}from"./List-Bt_VxheE.js";import{H as n}from"./DefaultResultListItem-C5HsaeVF.js";import{a as N}from"./SearchResultList-BvHUEv9x.js";import{O as q}from"./appWrappers-BaWcwZMN.js";import{L as w}from"./ListItem-BICUgtEX.js";import{a as A}from"./Plugin-RXoEb6tP.js";import{S as E}from"./SearchContext-CynHsH_q.js";import{L as W}from"./Link-BBOsyqXp.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ClnHTvOa.js";import"./Add-CifdFktV.js";import"./ArrowForwardIos-BX0Sssbq.js";import"./translation-tkBE4Dw7.js";import"./useAnalytics-B1tdSmq6.js";import"./Select-By12LrS4.js";import"./index-B9sM2jn7.js";import"./Popover-DczWzLzz.js";import"./Modal-CvfL3O1K.js";import"./Portal-Cx0C7hOu.js";import"./formControlState-DB5x5YOj.js";import"./MenuItem-Bx9WNCtz.js";import"./ListSubheader-LnMizxkm.js";import"./Chip-uhMZhRO3.js";import"./makeStyles-BHo2IBLU.js";import"./EmptyState-DJ4BpB2r.js";import"./Grid-3D9u4l8r.js";import"./Progress-CKp04M1G.js";import"./LinearProgress-DWMptQjJ.js";import"./Box-CiofjXgh.js";import"./styled-B4F0dw99.js";import"./ResponseErrorPanel-a-6C4JXV.js";import"./ErrorPanel-afGinZys.js";import"./WarningPanel-ChoLhM-U.js";import"./ExpandMore-DudBgA4X.js";import"./AccordionDetails-DHQKlz72.js";import"./Collapse-C3Lt1qny.js";import"./MarkdownContent-CrtvNdWY.js";import"./CodeSnippet-BCp1dgf9.js";import"./ListItemText-Ah0rTT0N.js";import"./ListContext-DMa2K4C7.js";import"./CopyTextButton-BQQISJCS.js";import"./useCopyToClipboard-C8ecOTn7.js";import"./useMountedState-CnSySDzk.js";import"./Tooltip-ChAjjmE8.js";import"./useObjectRef-CPQl0FPH.js";import"./useOverlayTriggerState-BMh6qldU.js";import"./utils-BR4WWUPw.js";import"./useFocusRing-ChTmVwiQ.js";import"./openLink-CUqeOgDt.js";import"./number-v8QHaCn-.js";import"./I18nProvider-QDJG5ejG.js";import"./useControlledState-CXF1rY7r.js";import"./animation-DU5l6MIa.js";import"./useHover-C7AGz9RX.js";import"./ButtonIcon-CKZEErcO.js";import"./Button-CNFlQLM7.js";import"./Label-67Mz0DTG.js";import"./Hidden-BT-waPLA.js";import"./useLabel-D8B5Ekv6.js";import"./useLabels-CrgyuspR.js";import"./useButton-CtCvtk7k.js";import"./usePress-D5PsofWG.js";import"./textSelection-C16VXh1L.js";import"./index-1kifiLVj.js";import"./Divider-CbGLj0gZ.js";import"./useAsync-DXF9iof3.js";import"./lodash-KEAh9Gl1.js";import"./useElementFilter-JagACkd6.js";import"./componentData-0C9L9b0T.js";import"./ListItemIcon-9AsF9plF.js";import"./WebStorage-BzHu-HT4.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CAWuc5G6.js";import"./useIsomorphicLayoutEffect-BP1UAeEv.js";import"./useApp-CXgo0NWV.js";import"./BUIProvider-DxfsVl8y.js";import"./useResolvedHref-CKBZ7MYz.js";import"./useRouteRef-BkYIUSQI.js";import"./index-DUl2QbDn.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},O=new _(M),ye={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,O]],children:t.jsx(E,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},m=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),a=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=A({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};m.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
