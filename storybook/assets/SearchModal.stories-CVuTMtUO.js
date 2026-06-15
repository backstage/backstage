import{bR as t,u as d,l as u,a5 as h}from"./iframe-CNmrqhdp.js";import{r as g}from"./plugin-DlP-rylR.js";import{S as m,u as n,b as x}from"./useSearchModal-B2b1ndR6.js";import{B as c}from"./Button-9-qLVWPx.js";import{c as S,b as f,a as M}from"./DialogTitle-p_licHuk.js";import{B as j}from"./Box-1MBd1NdD.js";import{S as r}from"./Grid-BGPHOMQP.js";import{S as C}from"./SearchType-D5YOnCif.js";import{L as y}from"./List-ahum0BRu.js";import{H as R}from"./DefaultResultListItem-BX8KIwLU.js";import{O as I}from"./appWrappers-TRDMH51E.js";import{m as B}from"./makeStyles-CoULisOM.js";import{s as D,M as b}from"./api-CoPVOKZF.js";import{S as k}from"./SearchContext-6AdMozhh.js";import{SearchBar as v}from"./SearchBar-BV9z6Pvs.js";import{S as T}from"./SearchResult-DfY6Df-h.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DkIbyARY.js";import"./Plugin-BA0J1vJQ.js";import"./componentData-Bajmr2_W.js";import"./useAnalytics-BfmOd9pS.js";import"./useApp-DjNgU9QR.js";import"./useRouteRef-8V-QgAtT.js";import"./ArrowForward-CUAAGA4B.js";import"./translation-CXzDU3zg.js";import"./Page-DE9edhl1.js";import"./useMediaQuery-pqUoJTtU.js";import"./Divider-DvCVn6dj.js";import"./ArrowBackIos-CM8SKxcP.js";import"./ArrowForwardIos-B7dQgJyv.js";import"./translation-93xhI-OU.js";import"./Modal-Bj4IWEm7.js";import"./Portal-BeWhklMr.js";import"./Backdrop-8aWl33WM.js";import"./styled-wlFTiasm.js";import"./ExpandMore-C1SJEl53.js";import"./useAsync-AVyJcLhD.js";import"./useMountedState-CokGl4ZB.js";import"./AccordionDetails-C0yuhCvO.js";import"./index-B9sM2jn7.js";import"./Collapse-DkReGfOr.js";import"./ListItem-B6bQ60ol.js";import"./ListContext-B5UlMvnw.js";import"./ListItemIcon-PtywKY5-.js";import"./ListItemText-BeWx-Vvf.js";import"./Tabs-DqJgtTEt.js";import"./KeyboardArrowRight-BVtX_x0F.js";import"./FormLabel-CReW77_N.js";import"./formControlState-DzzoqcVY.js";import"./InputLabel-CrwwtwJP.js";import"./Select-BRs4pJN5.js";import"./Popover-DXsb97Zc.js";import"./MenuItem-DpDyyn3a.js";import"./Checkbox-nQOx_B4l.js";import"./SwitchBase-UYIg4lyI.js";import"./Chip-Cs6bdejH.js";import"./Link-Buntv2pG.js";import"./index-CecqzQJ6.js";import"./lodash-DcRUHytK.js";import"./WebStorage-C7CWBF3C.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-6BaQCvWb.js";import"./useIsomorphicLayoutEffect-BrvmqhnJ.js";import"./BUIProvider-DQTw1zNm.js";import"./openLink-Dcd4pMbN.js";import"./useResolvedHref-wx132o6L.js";import"./Search-DAgHe-M4.js";import"./useDebounce-Dylur5rd.js";import"./InputAdornment-ekSZOX9E.js";import"./TextField-DcxaPUR4.js";import"./useElementFilter-ZfzbKvpN.js";import"./EmptyState-CrcGjEni.js";import"./Progress--oYdH08K.js";import"./LinearProgress-DyvRqfdb.js";import"./ResponseErrorPanel-CzYS-I-S.js";import"./ErrorPanel-r6vIQ9Y1.js";import"./WarningPanel-kTOcUjWz.js";import"./MarkdownContent-CcNF5Ko8.js";import"./CodeSnippet-B4QHrZxA.js";import"./CopyTextButton-1pXQlLSE.js";import"./useCopyToClipboard-BX3Cc1_x.js";import"./Tooltip-BQ2DH04K.js";import"./Popper-zherBlvX.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
