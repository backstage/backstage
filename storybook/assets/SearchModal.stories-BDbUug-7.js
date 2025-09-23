import{j as t,m as d,I as u,b as h,T as g}from"./iframe-Ca7Z-L4G.js";import{r as x}from"./plugin-DYkQUOKn.js";import{S as m,u as n,a as S}from"./useSearchModal-Pkrqaxu6.js";import{B as c}from"./Button-C4GDJaSU.js";import{a as f,b as M,c as j}from"./DialogTitle-CdHDbEvu.js";import{B as C}from"./Box-BAIj98gt.js";import{S as r}from"./Grid-auHuq8r2.js";import{S as y}from"./SearchType-CNsLIE7E.js";import{L as I}from"./List-CZA5eH2K.js";import{H as R}from"./DefaultResultListItem-CcVWFdUM.js";import{s as B,M as D}from"./api-DI73kWJB.js";import{S as T}from"./SearchContext-DdegsUV-.js";import{w as k}from"./appWrappers-DRvX8LbQ.js";import{SearchBar as v}from"./SearchBar-BpAG62up.js";import{a as b}from"./SearchResult-hjDim9ni.js";import"./preload-helper-D9Z9MdNV.js";import"./index-D5Wi8gI-.js";import"./Plugin-C1QQDTm-.js";import"./componentData-_1Qfjr2u.js";import"./useAnalytics-B4tVP_DV.js";import"./useApp-CAw2wdK9.js";import"./useRouteRef-DDQzGExo.js";import"./index-BJKCiffA.js";import"./ArrowForward-DUXpUVfv.js";import"./translation-DcAgMdni.js";import"./Page-pJhfQI2U.js";import"./useMediaQuery-SoLzvs9M.js";import"./Divider-zG-YiM3h.js";import"./ArrowBackIos-BIlhtKW8.js";import"./ArrowForwardIos-EfhsUx2y.js";import"./translation-CO_jpESK.js";import"./Modal-DgmZg7sP.js";import"./Portal-BioI0xEQ.js";import"./Backdrop-DXmAjQVD.js";import"./styled-C18e2gIS.js";import"./ExpandMore-CMMWGbBw.js";import"./useAsync-DSkJAg62.js";import"./useMountedState-CV_rLf93.js";import"./AccordionDetails-CcpJ8mhZ.js";import"./index-DnL3XN75.js";import"./Collapse-n2Kb8itc.js";import"./ListItem-C9nJC85u.js";import"./ListContext-B_Im9Dn6.js";import"./ListItemIcon-BNgxXteL.js";import"./ListItemText-DZSn-Gas.js";import"./Tabs-CFozYLzz.js";import"./KeyboardArrowRight-BBrljslD.js";import"./FormLabel-qc-IFA2K.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C-Q8lpQF.js";import"./InputLabel-C2usU0pq.js";import"./Select-DxKKxtIl.js";import"./Popover-CcKmVttI.js";import"./MenuItem-DT4YPicg.js";import"./Checkbox-CFOiu_oi.js";import"./SwitchBase-43sqdZDc.js";import"./Chip-Du02hAg4.js";import"./Link-D6f9g5gT.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-DntrMzpR.js";import"./useIsomorphicLayoutEffect-C-EeS4cl.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-CKHpIhd5.js";import"./useDebounce-D5dwt3eB.js";import"./InputAdornment-BmFiG6xQ.js";import"./TextField-V411MSV4.js";import"./useElementFilter-BWOfhaQF.js";import"./EmptyState-BQMs-c7g.js";import"./Progress-D9_N7f9f.js";import"./LinearProgress-C7VwhN_u.js";import"./ResponseErrorPanel-BYivxHmY.js";import"./ErrorPanel-zLmvMY6B.js";import"./WarningPanel-DU1kckLo.js";import"./MarkdownContent-CoRCbhDs.js";import"./CodeSnippet-BKse1xIH.js";import"./CopyTextButton-DcJl0ww3.js";import"./useCopyToClipboard-vqdrk62a.js";import"./Tooltip-BxH5cU7h.js";import"./Popper-BHTXlPRY.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
