import{j as t,W as d,a3 as u,a2 as h}from"./iframe-C8vBbMI-.js";import{r as g}from"./plugin-BpOoktbf.js";import{S as l,u as n,a as x}from"./useSearchModal-DXPXoRLN.js";import{B as c}from"./Button-DwUxRaKW.js";import{D as S,a as f,b as M}from"./DialogTitle-DaQwnuQt.js";import{B as j}from"./Box-DIT1JwxG.js";import{S as r}from"./Grid-DduoCecT.js";import{S as C}from"./SearchType-YFsk6QL4.js";import{L as y}from"./List-B5861Df-.js";import{H as I}from"./DefaultResultListItem-Bb7NmcUc.js";import{w as R}from"./appWrappers-DNGG9sUg.js";import{m as B}from"./makeStyles-DEhzw0UI.js";import{s as D,M as k}from"./api-CbmJOaWK.js";import{S as v}from"./SearchContext-OHn2FbKL.js";import{SearchBar as T}from"./SearchBar-CbqTs550.js";import{S as b}from"./SearchResult-DS50VvJt.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D7amwu8k.js";import"./Plugin-BAyN1Xxt.js";import"./componentData-DAGxZ2o0.js";import"./useAnalytics-DKfC2Yhe.js";import"./useApp-Cchg7qe1.js";import"./useRouteRef-B6mbdMu5.js";import"./ArrowForward-C4RmmrRl.js";import"./translation-CcGaBzXh.js";import"./Page-DlWnHsYp.js";import"./useMediaQuery-BArYkJcY.js";import"./Divider-C0HO5IHG.js";import"./ArrowBackIos-By9RHCEP.js";import"./ArrowForwardIos-CWG6zUCr.js";import"./translation-oJ6Nj3uV.js";import"./Modal-DmcxaYfQ.js";import"./Portal-DsizZWpB.js";import"./Backdrop-CXmQUHq5.js";import"./styled-BcmF7aJU.js";import"./ExpandMore-ByaxlCxC.js";import"./useAsync-4Fi35BbH.js";import"./useMountedState-L9pPr6Rc.js";import"./AccordionDetails-BnfLglm0.js";import"./index-B9sM2jn7.js";import"./Collapse-C7FCoWud.js";import"./ListItem-BfkYT0su.js";import"./ListContext-BiZJobBt.js";import"./ListItemIcon-CWUulcam.js";import"./ListItemText-BRoLRp27.js";import"./Tabs-B6m96sbo.js";import"./KeyboardArrowRight-CBp9jmRy.js";import"./FormLabel-CSQXxZa8.js";import"./formControlState-BzaeKgvg.js";import"./InputLabel-6MDyvi_5.js";import"./Select-CKpUV9w2.js";import"./Popover-CaOdYvW5.js";import"./MenuItem-XMxRQMfl.js";import"./Checkbox-DngeN6B7.js";import"./SwitchBase-Yl3nV53k.js";import"./Chip-CJrsAn60.js";import"./Link-CaYIfEDR.js";import"./index-NluNtBNI.js";import"./lodash-BfwZDLak.js";import"./WebStorage-Bp2sRg0r.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DjzOt1cE.js";import"./useIsomorphicLayoutEffect-DUo-5b2e.js";import"./BUIProvider-CEL4NntB.js";import"./openLink-B9VHRTOW.js";import"./useResolvedHref-cJdDhzhd.js";import"./Search-C8NeyETa.js";import"./useDebounce-BD4CkbPR.js";import"./InputAdornment-ByhQylA2.js";import"./TextField-p_vsfE8N.js";import"./useElementFilter-CPA6T5oy.js";import"./EmptyState-2bYJ3lLr.js";import"./Progress-ClQqqy36.js";import"./LinearProgress-BfSvZPD6.js";import"./ResponseErrorPanel--K5Z2q8d.js";import"./ErrorPanel--gZKU3Sg.js";import"./WarningPanel-CSsnlZMV.js";import"./MarkdownContent-CDHzH2rL.js";import"./CodeSnippet-0NjTet8j.js";import"./CopyTextButton-CeNYTrC1.js";import"./useCopyToClipboard-B1eZHJkf.js";import"./Tooltip-j_b-FrAj.js";import"./Popper-BLUE86cB.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
