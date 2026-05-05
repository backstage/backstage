import{j as t,W as d,a3 as u,a2 as h}from"./iframe-CBMR_Zns.js";import{r as g}from"./plugin-DJgunlkL.js";import{S as l,u as n,a as x}from"./useSearchModal-DkrYi1x-.js";import{B as c}from"./Button-DZakymzu.js";import{D as S,a as f,b as M}from"./DialogTitle-rw4mjyWq.js";import{B as j}from"./Box-DRo0xUou.js";import{S as r}from"./Grid-Dj5TTCpv.js";import{S as C}from"./SearchType-C2QRChgY.js";import{L as y}from"./List-yyB1VOVV.js";import{H as I}from"./DefaultResultListItem-CRnFHA5I.js";import{w as R}from"./appWrappers-BnfNs8pT.js";import{m as B}from"./makeStyles-sF8PfItD.js";import{s as D,M as k}from"./api-1WyMO0Wu.js";import{S as v}from"./SearchContext-Bg8yiycE.js";import{SearchBar as T}from"./SearchBar-DRY11P5u.js";import{S as b}from"./SearchResult-tSk_kHd9.js";import"./preload-helper-PPVm8Dsz.js";import"./index-4zsJGZ2G.js";import"./Plugin-C2cmEbwE.js";import"./componentData-DtiW7rWZ.js";import"./useAnalytics-2o7uH7x2.js";import"./useApp-CBwGPM4M.js";import"./useRouteRef-DFeh6mKR.js";import"./ArrowForward-C3dox-7b.js";import"./translation-BZprEjRh.js";import"./Page-BBtdj0F4.js";import"./useMediaQuery-ySAN6sPr.js";import"./Divider-W3olFd1W.js";import"./ArrowBackIos-CbL2zM1L.js";import"./ArrowForwardIos-BODrfDvP.js";import"./translation-CnxSsfEy.js";import"./Modal-Bvyfvxh5.js";import"./Portal-HQVuNq59.js";import"./Backdrop-DdaowzBR.js";import"./styled-Fdl9HABt.js";import"./ExpandMore-C7lVdomT.js";import"./useAsync-DfHFGo6-.js";import"./useMountedState-CYyJnhmf.js";import"./AccordionDetails-CvJuRNsn.js";import"./index-B9sM2jn7.js";import"./Collapse-C0Mf3OWg.js";import"./ListItem-DwcTS-Gk.js";import"./ListContext-B9Lnotut.js";import"./ListItemIcon-Dv_2JZgq.js";import"./ListItemText-C3372Kse.js";import"./Tabs-BoGoC3sP.js";import"./KeyboardArrowRight-CI1FdONE.js";import"./FormLabel-DMhAd0Xu.js";import"./formControlState-BTyqUe3C.js";import"./InputLabel-DCj1Xpnt.js";import"./Select-BKtYPxo_.js";import"./Popover-CM_pJ0Em.js";import"./MenuItem-B5pFX5iW.js";import"./Checkbox-DRBnKfpK.js";import"./SwitchBase-C9qi4dja.js";import"./Chip-DUxi03rD.js";import"./Link-DSfdg0tL.js";import"./index-BkiKfy6N.js";import"./lodash-CkAY2xSD.js";import"./WebStorage-BnEnooll.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DMqrvXE7.js";import"./useIsomorphicLayoutEffect-MoBArEH8.js";import"./BUIProvider-CrKTt50y.js";import"./openLink-ChAauiNp.js";import"./useResolvedHref-CZHOSwzU.js";import"./Search-D_FWfsrg.js";import"./useDebounce-Bo5e_6RC.js";import"./InputAdornment-DaF9CP6U.js";import"./TextField-DRbSnI8t.js";import"./useElementFilter-CXN5zXKO.js";import"./EmptyState-IRG9v9_Y.js";import"./Progress-BaeiZlxQ.js";import"./LinearProgress-BrL9XZbN.js";import"./ResponseErrorPanel-CCHd7H6G.js";import"./ErrorPanel-C-svbPUf.js";import"./WarningPanel-CCW-lmK-.js";import"./MarkdownContent-CK1Ftajp.js";import"./CodeSnippet-DAEyWRmV.js";import"./CopyTextButton-CJEDUKzV.js";import"./useCopyToClipboard-B8cKa4TS.js";import"./Tooltip-C_Z4nOgm.js";import"./Popper-7279CciU.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
