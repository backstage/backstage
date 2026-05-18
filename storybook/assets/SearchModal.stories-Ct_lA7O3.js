import{j as t,W as d,a3 as u,a2 as h}from"./iframe-t9H7a1GP.js";import{r as g}from"./plugin-Cx-U2-F2.js";import{S as l,u as n,a as x}from"./useSearchModal--91Bqqec.js";import{B as c}from"./Button-HLfnNrg4.js";import{D as S,a as f,b as M}from"./DialogTitle-Dish6E3I.js";import{B as j}from"./Box-Ca_FhWzH.js";import{S as r}from"./Grid-Cv9MyPTj.js";import{S as C}from"./SearchType-Caq4aD2y.js";import{L as y}from"./List-0f6LLPdL.js";import{H as I}from"./DefaultResultListItem-ClXxxyMj.js";import{w as R}from"./appWrappers-C6UyNlqa.js";import{m as B}from"./makeStyles-D3euK8x9.js";import{s as D,M as k}from"./api-BoJ2Y1uq.js";import{S as v}from"./SearchContext-DZsKrwBL.js";import{SearchBar as T}from"./SearchBar-B_6IfcSL.js";import{S as b}from"./SearchResult-Bvc2gTMN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B7IsTx9H.js";import"./Plugin-DSpA77qF.js";import"./componentData-CLPVPrKa.js";import"./useAnalytics-CPvjMD4k.js";import"./useApp-BO5_SDAO.js";import"./useRouteRef-CLF0O-Vs.js";import"./ArrowForward-DsJwVzxj.js";import"./translation-cofLPywb.js";import"./Page-CB7g6hq2.js";import"./useMediaQuery-q-eUIbsr.js";import"./Divider-CNlpK22j.js";import"./ArrowBackIos-CEnGfGFT.js";import"./ArrowForwardIos-BQ3K5pPK.js";import"./translation-DArAQ63w.js";import"./Modal-BdWhQ_fv.js";import"./Portal-DcWiiunN.js";import"./Backdrop-DTRjsHQE.js";import"./styled-GR2b4kqg.js";import"./ExpandMore-Dtgj-XOJ.js";import"./useAsync-Be7Ygkwj.js";import"./useMountedState-DJhuUCV5.js";import"./AccordionDetails-CVmBM6rK.js";import"./index-B9sM2jn7.js";import"./Collapse-BxZNoJHM.js";import"./ListItem-DkFcAkFQ.js";import"./ListContext-1ZEJeBTD.js";import"./ListItemIcon-FIHd_PUX.js";import"./ListItemText-VLp5yEt_.js";import"./Tabs-CCLxNtAi.js";import"./KeyboardArrowRight-BQLGqP_I.js";import"./FormLabel-Cce1ncpY.js";import"./formControlState-Dqfyq44O.js";import"./InputLabel-DE3yG4NH.js";import"./Select-C95OQT13.js";import"./Popover-C_-i1x2h.js";import"./MenuItem-Cn9fYDDL.js";import"./Checkbox-DWoz5HUY.js";import"./SwitchBase-6hX-H2JC.js";import"./Chip-BDQyetv3.js";import"./Link-B3MFkp5k.js";import"./index-CuWwFMcz.js";import"./lodash-CR-8Qmjt.js";import"./WebStorage-CTdtiabw.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BYCl3NFm.js";import"./useIsomorphicLayoutEffect-CiEcTVQx.js";import"./BUIProvider-DkLDzyw8.js";import"./openLink-B2Zr3UoO.js";import"./useResolvedHref-ByM8xp8i.js";import"./Search-BdvTWCtK.js";import"./useDebounce-NHw1xu5B.js";import"./InputAdornment-BtQ5Doq1.js";import"./TextField-CkvF23Ky.js";import"./useElementFilter-DxfdbctR.js";import"./EmptyState-BaNGjEMO.js";import"./Progress-DiP5F5VJ.js";import"./LinearProgress-12oOl3hL.js";import"./ResponseErrorPanel-BItB07YU.js";import"./ErrorPanel-DuXRqjsp.js";import"./WarningPanel-DQdBjCzo.js";import"./MarkdownContent-CR2NMh-B.js";import"./CodeSnippet-Ns24n3-t.js";import"./CopyTextButton-zOLhOJvH.js";import"./useCopyToClipboard-BaK9c688.js";import"./Tooltip-4n2HrPms.js";import"./Popper-gP0R36E2.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
