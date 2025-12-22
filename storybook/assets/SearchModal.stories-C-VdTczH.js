import{j as t,m as d,I as u,b as h,T as g}from"./iframe-DZkam7Bj.js";import{r as x}from"./plugin-Bl7BuGsa.js";import{S as m,u as n,a as S}from"./useSearchModal-CzmQEdtZ.js";import{B as c}from"./Button-C84XLh64.js";import{a as f,b as M,c as j}from"./DialogTitle-BODx1QEM.js";import{B as C}from"./Box-DChwE7Ki.js";import{S as r}from"./Grid-DBMZs7np.js";import{S as y}from"./SearchType-DgWKLcWr.js";import{L as I}from"./List-Ca4J4jzY.js";import{H as R}from"./DefaultResultListItem-CWmY9uUO.js";import{s as B,M as D}from"./api-apMlJzbK.js";import{S as T}from"./SearchContext-CxKaLjlh.js";import{w as k}from"./appWrappers-Bg6ecWLG.js";import{SearchBar as v}from"./SearchBar-_DDOL1YF.js";import{a as b}from"./SearchResult-Ds1nwlgH.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cy-AkiNB.js";import"./Plugin-D0wcgIxz.js";import"./componentData-D2mgrz7C.js";import"./useAnalytics-RqWf-jVc.js";import"./useApp-CAfcC71X.js";import"./useRouteRef-BbGjzdGG.js";import"./index-BYedHEZ0.js";import"./ArrowForward-DJhLoZFc.js";import"./translation-TZ19OauE.js";import"./Page-CQ8nzwAx.js";import"./useMediaQuery-Chsf4aBi.js";import"./Divider-CrMgh5SC.js";import"./ArrowBackIos-DaN9kNvw.js";import"./ArrowForwardIos-ABRfi1Vm.js";import"./translation-BNCjc-Aa.js";import"./Modal-Dli2H9pG.js";import"./Portal-mqL5KVNN.js";import"./Backdrop-970MLPke.js";import"./styled-RI4GT_4U.js";import"./ExpandMore-B142-YHG.js";import"./useAsync-BRCkrjty.js";import"./useMountedState-ChfRzppL.js";import"./AccordionDetails-4Wsid_gA.js";import"./index-B9sM2jn7.js";import"./Collapse-CyMpxX-e.js";import"./ListItem-DNrM1AYn.js";import"./ListContext-D7S-zqsj.js";import"./ListItemIcon-WCF4l5uO.js";import"./ListItemText-CiywuPc3.js";import"./Tabs-BcZ8biOF.js";import"./KeyboardArrowRight-BC0OvGnL.js";import"./FormLabel-5WzzBTLf.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Bow_Y-R1.js";import"./InputLabel-BS7L9kZn.js";import"./Select-RPFPlcQc.js";import"./Popover-H9d7tLDo.js";import"./MenuItem-DOAQS7yJ.js";import"./Checkbox-Di6xTSCP.js";import"./SwitchBase-cWGQD-P0.js";import"./Chip-C7BMjs9y.js";import"./Link-BoLwiIPW.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-CEhyWTyT.js";import"./useIsomorphicLayoutEffect-DFCzL8zZ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-HxENO37d.js";import"./useDebounce-DLAdrhFQ.js";import"./InputAdornment-YWYYd8GG.js";import"./TextField-BIDDbRCE.js";import"./useElementFilter-BHEEoc09.js";import"./EmptyState-DccpdoPw.js";import"./Progress-Cs6T_nD_.js";import"./LinearProgress-BsMMUx7S.js";import"./ResponseErrorPanel-BN3YxU6v.js";import"./ErrorPanel-DvnF6D1Z.js";import"./WarningPanel-W5ZE-W22.js";import"./MarkdownContent-0F8rqmt_.js";import"./CodeSnippet-BFE5NLd5.js";import"./CopyTextButton-Bji7cX2P.js";import"./useCopyToClipboard-DSpaqeDH.js";import"./Tooltip-D0UPjqYE.js";import"./Popper-CT_phagK.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
