import{aJ as I,aK as L,aL as S,aM as j,aC as g,j as t,X as D}from"./iframe-CIT-dZu_.js";import{c as f,D as v}from"./InsertDriveFile-CPxJDOjt.js";import{s as C,M as _}from"./api-BIvPCHlh.js";import{S as o,c as k}from"./SearchResult-1kfMfqjE.js";import{L as R}from"./List-DWlZD8z9.js";import{H as n}from"./DefaultResultListItem-DcVbe2pC.js";import{a as N}from"./SearchResultList-DZdIF5gH.js";import{w as q}from"./appWrappers-BLSLivpy.js";import{L as w}from"./ListItem-Dm8k4XZR.js";import{c as A}from"./Plugin-BR7F4ypl.js";import{S as E}from"./SearchContext-CyYTGuj6.js";import{L as W}from"./Link-CpjWFI-c.js";import"./preload-helper-PPVm8Dsz.js";import"./index-L1IHakWM.js";import"./Add-1z4l-6Mt.js";import"./ArrowForwardIos-Ff5O5Y5L.js";import"./translation-WF1GcINk.js";import"./useAnalytics-DnCYApMA.js";import"./Select-DVj51rx8.js";import"./index-B9sM2jn7.js";import"./Popover-CdhPhseu.js";import"./Modal-Bt2cneYZ.js";import"./Portal-D0CrObPP.js";import"./formControlState-ChHgNyNw.js";import"./MenuItem-ri8KWyHU.js";import"./ListSubheader-3rATB6NM.js";import"./Chip-Dio_IvLH.js";import"./makeStyles-CS1pZXKe.js";import"./EmptyState-m9OUMTAd.js";import"./Grid-lcFrT8I1.js";import"./Progress-Ccm818mP.js";import"./LinearProgress-DdzsMX29.js";import"./Box-Cl1WRrl1.js";import"./styled-ezS9pEl7.js";import"./ResponseErrorPanel-DvdJp1gB.js";import"./ErrorPanel-Dbcg21SQ.js";import"./WarningPanel-C3bhPiN2.js";import"./ExpandMore-CXSEGLAk.js";import"./AccordionDetails-BG1S2WMZ.js";import"./Collapse-Bce_Nnnm.js";import"./MarkdownContent-BKw6et7U.js";import"./ListItemText-DYNNiolN.js";import"./ListContext-Ce2BqoB3.js";import"./CopyTextButton-Ba4-8T-c.js";import"./useCopyToClipboard-Dto8Kasq.js";import"./useMountedState-s2okVxfw.js";import"./Tooltip-2dCQur-O.js";import"./useObjectRef-B4D9CzQM.js";import"./useOverlayTriggerState-B26sLsFg.js";import"./utils-3SfRWDXk.js";import"./useFocusRing-ByVMGaNA.js";import"./number-BCBVXMPD.js";import"./I18nProvider-CmgCSkj9.js";import"./useControlledState-Bo32Yv4j.js";import"./animation-pATfZ50U.js";import"./useHover-tuK_rbDS.js";import"./ButtonIcon-CoxYVv_r.js";import"./Button-BzxePFvu.js";import"./Label-BoyMwewe.js";import"./Hidden-paCviALj.js";import"./useLabel-Cq-2nnHJ.js";import"./useLabels-BEUaVICg.js";import"./useButton-B66KWxu2.js";import"./usePress-BOnalXjM.js";import"./textSelection-aEjP62Wo.js";import"./getMetaValue-SvU3Wp5k.js";import"./index-C4qi6jZX.js";import"./Divider-BqD5GKWO.js";import"./CodeSnippet-DQQln6v9.js";import"./useAsync-DQRKAK2T.js";import"./lodash-2vuPdsKC.js";import"./useElementFilter-CSmDoJFK.js";import"./componentData-FNzt3Gb-.js";import"./ListItemIcon-BbfAhDDF.js";import"./WebStorage-H1s3aA7_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-bElBlM3z.js";import"./useObservable-CXvUbn17.js";import"./useIsomorphicLayoutEffect-BpFVEX6_.js";import"./useApp-BxfNURiw.js";import"./BUIProvider-DvUfRZ9N.js";import"./useRouteRef-CV0cv-s3.js";import"./index-B-HyNN-b.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const M=g(H),P={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},z=new _(P),ye={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,z]],children:t.jsx(E,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},m=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),a=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(M,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=A({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};m.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
