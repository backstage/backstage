import{bR as t,u as d,l as u,a5 as h}from"./iframe-Bm5ba6Eo.js";import{r as g}from"./plugin-D32f2nWs.js";import{S as m,u as n,b as x}from"./useSearchModal-DqOpvp6H.js";import{B as c}from"./Button-DO8BgoM5.js";import{c as S,b as f,a as M}from"./DialogTitle-D4oxxwFC.js";import{B as j}from"./Box-NESd7kYt.js";import{S as r}from"./Grid-2YxRqddS.js";import{S as C}from"./SearchType-DwUN7N__.js";import{L as y}from"./List-CJhMPRPP.js";import{H as R}from"./DefaultResultListItem-qHZ5ErQJ.js";import{O as I}from"./appWrappers-CjN0uS8o.js";import{m as B}from"./makeStyles-BxPw9vCe.js";import{s as D,M as b}from"./api-6tYSjb2W.js";import{S as k}from"./SearchContext-hvWarYky.js";import{SearchBar as v}from"./SearchBar-KM8mxEsy.js";import{S as T}from"./SearchResult-qPcEsyqZ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DFYQHB0n.js";import"./Plugin-DktZ4BGz.js";import"./componentData-VX6GSl-M.js";import"./useAnalytics-BQdStjBt.js";import"./useApp-kMVg8txh.js";import"./useRouteRef-B5wYKb_5.js";import"./ArrowForward-zryWdhUC.js";import"./translation-qmYOz1yO.js";import"./Page-GHPfoNq2.js";import"./useMediaQuery-C64kqk46.js";import"./Divider-DgXuoSNG.js";import"./ArrowBackIos-CPMJmkhF.js";import"./ArrowForwardIos-CkW5nqPC.js";import"./translation-Dhmn5mhy.js";import"./Modal-Cx8YqiY2.js";import"./Portal-Cg5Nvqt2.js";import"./Backdrop-Cmca6841.js";import"./styled-DeEwf9nS.js";import"./ExpandMore-DZhVJ5gx.js";import"./useAsync-BFTdLWGt.js";import"./useMountedState-CX6Pdejq.js";import"./AccordionDetails-BH84Cqgt.js";import"./index-B9sM2jn7.js";import"./Collapse-8dQvh7gn.js";import"./ListItem-UVpWaDMa.js";import"./ListContext-CVjS-G2V.js";import"./ListItemIcon-BIBGeTx2.js";import"./ListItemText-D1JMY5d6.js";import"./Tabs-BB4Ir0GU.js";import"./KeyboardArrowRight-DpTPYhfS.js";import"./FormLabel-B8HHe0vy.js";import"./formControlState-BIqw7ICg.js";import"./InputLabel-C2OYVFQH.js";import"./Select-EsGPAfN_.js";import"./Popover-CYDJVvd7.js";import"./MenuItem-D2iqw-vS.js";import"./Checkbox-w9yG33zI.js";import"./SwitchBase-DC-Y3upw.js";import"./Chip-C4iYXxfQ.js";import"./Link-BddbTmYm.js";import"./index-ob8zNRki.js";import"./lodash-KBhUdAYx.js";import"./WebStorage-Ddi_3Tst.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CzA18W9B.js";import"./useIsomorphicLayoutEffect-ChAZlZKa.js";import"./BUIProvider-BToDF3TK.js";import"./openLink-B3PKQziN.js";import"./useResolvedHref-DYKBvNag.js";import"./Search-D06LRQQv.js";import"./useDebounce-6EQYSDkx.js";import"./InputAdornment-DA2Nrrwf.js";import"./TextField-DgeH7O0H.js";import"./useElementFilter-CU0OSqen.js";import"./EmptyState-DgStH4SM.js";import"./Progress-C1gvWhvN.js";import"./LinearProgress-CUWL3Pet.js";import"./ResponseErrorPanel-Curs6Dcv.js";import"./ErrorPanel-NY_QZQW2.js";import"./WarningPanel-DkzSJ2lp.js";import"./MarkdownContent-Ck3aSIvu.js";import"./CodeSnippet-DRGENOjW.js";import"./CopyTextButton-BbbFijNF.js";import"./useCopyToClipboard-T3ghPtvH.js";import"./Tooltip-Dj-fCTBD.js";import"./Popper-SjxBkGs3.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
