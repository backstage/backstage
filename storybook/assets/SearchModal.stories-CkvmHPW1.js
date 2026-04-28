import{j as t,W as d,a3 as u,a2 as h}from"./iframe-Tg-tOL7r.js";import{r as g}from"./plugin-4RmJIa37.js";import{S as l,u as n,a as x}from"./useSearchModal-B0iDhiII.js";import{B as c}from"./Button-C-mblHrF.js";import{D as S,a as f,b as M}from"./DialogTitle-DLIsOCt6.js";import{B as j}from"./Box-OYxHzwcw.js";import{S as r}from"./Grid-CWzrm0bY.js";import{S as C}from"./SearchType-BJ7Dfw75.js";import{L as y}from"./List-Bn-Heble.js";import{H as I}from"./DefaultResultListItem-BQsB0QoL.js";import{w as R}from"./appWrappers-CpQeXvD0.js";import{m as B}from"./makeStyles-BHicTeCr.js";import{s as D,M as k}from"./api-Caq3e73F.js";import{S as v}from"./SearchContext-zRwsJ51H.js";import{SearchBar as T}from"./SearchBar-Db07-_F0.js";import{S as b}from"./SearchResult-Bv3YJ-As.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DeN5tXI5.js";import"./Plugin-B5IiwyD6.js";import"./componentData-CJeLmARs.js";import"./useAnalytics-DVZEM2og.js";import"./useApp-DATYOo-f.js";import"./useRouteRef-BXslgp52.js";import"./ArrowForward-BYnwR7Ik.js";import"./translation-XfcfCadx.js";import"./Page-DexsQoU6.js";import"./useMediaQuery-B74gwjlt.js";import"./Divider-Dat2vlo6.js";import"./ArrowBackIos-BrL3CVWU.js";import"./ArrowForwardIos-BWR9zPiV.js";import"./translation-ti2FuOI_.js";import"./Modal-C3ehDU_j.js";import"./Portal-D1OaIdE9.js";import"./Backdrop-g20bxOrt.js";import"./styled-vStV8VkZ.js";import"./ExpandMore-D5uHqsby.js";import"./useAsync-D1FTflyb.js";import"./useMountedState-21qTsz5p.js";import"./AccordionDetails-CKxrbGul.js";import"./index-B9sM2jn7.js";import"./Collapse-2l9C9_VC.js";import"./ListItem-BxOtbo8f.js";import"./ListContext-Bmt6Pt9F.js";import"./ListItemIcon-qmLlqmmE.js";import"./ListItemText-Bifl7FfV.js";import"./Tabs-gAxfqNDZ.js";import"./KeyboardArrowRight-BbgKpaXp.js";import"./FormLabel-4c4JNWeC.js";import"./formControlState-DQaH3PZr.js";import"./InputLabel-DTv8fbSg.js";import"./Select-7g3ek-9M.js";import"./Popover-DXjczkYd.js";import"./MenuItem-BFjbniHJ.js";import"./Checkbox-OXYLjdLU.js";import"./SwitchBase-CZCYJr-Q.js";import"./Chip-BrklqMzl.js";import"./Link-Cr3hmmz_.js";import"./index-bEg_r36Z.js";import"./lodash-BweN80hA.js";import"./WebStorage-DeO3pEM2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DNQvD2Zn.js";import"./useIsomorphicLayoutEffect-DH3wfc8X.js";import"./BUIProvider-4FOo13WU.js";import"./openLink-D0gPIJFP.js";import"./useResolvedHref-BsheTZYw.js";import"./Search-Bz__obop.js";import"./useDebounce-hA25u97j.js";import"./InputAdornment-ClluSjRN.js";import"./TextField-Dzhf8-01.js";import"./useElementFilter-CcgYZRo3.js";import"./EmptyState-Df_rNMMA.js";import"./Progress-BCNnIzv2.js";import"./LinearProgress-y3TN0QX7.js";import"./ResponseErrorPanel-CSOjqkl2.js";import"./ErrorPanel-Dd70HXyQ.js";import"./WarningPanel-B6WHjrG9.js";import"./MarkdownContent-CdI6l00u.js";import"./CodeSnippet-C5Tydu1Z.js";import"./CopyTextButton-Chh78sPf.js";import"./useCopyToClipboard-Cl1GCTia.js";import"./Tooltip-YEgNEbvL.js";import"./Popper-Bs4wNPYC.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
