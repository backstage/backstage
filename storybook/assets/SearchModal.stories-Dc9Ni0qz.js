import{j as t,W as d,a3 as u,a2 as h}from"./iframe-izSSIzTR.js";import{r as g}from"./plugin-1-nIeXSi.js";import{S as l,u as n,a as x}from"./useSearchModal-D_Jldgw6.js";import{B as c}from"./Button-XKiaKw4a.js";import{D as S,a as f,b as M}from"./DialogTitle-CstHYyJU.js";import{B as j}from"./Box-BA3YWuLj.js";import{S as r}from"./Grid-DS_Ye4hI.js";import{S as C}from"./SearchType-Du9OudSG.js";import{L as y}from"./List-Bk9wyVdJ.js";import{H as I}from"./DefaultResultListItem-dVfQLxfP.js";import{w as R}from"./appWrappers-BgmJxH_O.js";import{m as B}from"./makeStyles-efJG6AvH.js";import{s as D,M as k}from"./api-DXAPgYrO.js";import{S as v}from"./SearchContext-CVQkOSvw.js";import{SearchBar as T}from"./SearchBar-BvxS-APM.js";import{S as b}from"./SearchResult-CuTZWjGB.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DJarkOCK.js";import"./Plugin-CKJPeleg.js";import"./componentData-4651iZqO.js";import"./useAnalytics-DIHZCFHN.js";import"./useApp-CAU_EJC9.js";import"./useRouteRef-BMFvCjE4.js";import"./ArrowForward-CKhRAqQ5.js";import"./translation-BdvHgyF2.js";import"./Page-D2h0DpVj.js";import"./useMediaQuery-BmcoM8-e.js";import"./Divider-CT2SL79S.js";import"./ArrowBackIos-Bcvb1N6-.js";import"./ArrowForwardIos-BuaN4NEE.js";import"./translation-BI960D-_.js";import"./Modal-BbQmRZa1.js";import"./Portal-gwFfNa32.js";import"./Backdrop-BURKwRpK.js";import"./styled-DV0BGOgt.js";import"./ExpandMore-Cro6Rs4P.js";import"./useAsync-fAA18DwO.js";import"./useMountedState-BNHFfL0T.js";import"./AccordionDetails-B2SuDynl.js";import"./index-B9sM2jn7.js";import"./Collapse-61rLnbUv.js";import"./ListItem-CLO1ybEL.js";import"./ListContext-CKBIT16f.js";import"./ListItemIcon-D16MAJMA.js";import"./ListItemText-BVZ15Dno.js";import"./Tabs-Dj4mJm0m.js";import"./KeyboardArrowRight-BZf9R7GN.js";import"./FormLabel-A-dydj7E.js";import"./formControlState-rlZ1bOrQ.js";import"./InputLabel-D50nqvI_.js";import"./Select-BsMdqjz8.js";import"./Popover-DdhQCyLQ.js";import"./MenuItem-CgKnBAX1.js";import"./Checkbox-CjRWyPfo.js";import"./SwitchBase-DnSy52Dc.js";import"./Chip-DD9LLMzJ.js";import"./Link-2J958yax.js";import"./index-DfUIGjtL.js";import"./lodash-BqgGC0cZ.js";import"./WebStorage-C9kBLkU3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-WPCyyj9u.js";import"./useIsomorphicLayoutEffect-M7hmcDdN.js";import"./BUIProvider-DHm8fNVT.js";import"./openLink-BZ37FDEF.js";import"./useResolvedHref-537MV3he.js";import"./Search-CApKFqAl.js";import"./useDebounce-iNpQmTU5.js";import"./InputAdornment-DUJaKPst.js";import"./TextField-Ca2WsZqo.js";import"./useElementFilter-BPmNjEaR.js";import"./EmptyState-DjEu_uC7.js";import"./Progress-BpW1NTfH.js";import"./LinearProgress-DEV4fRRQ.js";import"./ResponseErrorPanel-C3VtT7rw.js";import"./ErrorPanel-fD8NSdri.js";import"./WarningPanel-BM3a2g3z.js";import"./MarkdownContent-B9NWTZGU.js";import"./CodeSnippet-2YpUyrCc.js";import"./CopyTextButton-DrhwHmvQ.js";import"./useCopyToClipboard-DpcsO0N1.js";import"./Tooltip-BCaU-ke_.js";import"./Popper-BmNk75vF.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
