import{j as t,S as d,a0 as u,$ as h}from"./iframe-Pg_F-I9L.js";import{r as g}from"./plugin-BN3gKxpo.js";import{S as m,u as n,a as x}from"./useSearchModal-BjTf75JU.js";import{B as c}from"./Button-1fUtT4DD.js";import{D as S,a as f,b as M}from"./DialogTitle-1i0CxGOy.js";import{B as j}from"./Box-203OJvOv.js";import{S as r}from"./Grid-B2ie39ah.js";import{S as C}from"./SearchType-bUOAlWow.js";import{L as y}from"./List-6IhIysu1.js";import{H as I}from"./DefaultResultListItem-DCWPOu5O.js";import{w as R}from"./appWrappers-DSIoTw2r.js";import{m as B}from"./makeStyles-Cbx_09Po.js";import{s as D,M as k}from"./api-BSlZFPqe.js";import{S as v}from"./SearchContext-DSiWpP7g.js";import{SearchBar as T}from"./SearchBar-l1_sPyjA.js";import{S as b}from"./SearchResult-BiAGvI5q.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BTBUaq3i.js";import"./Plugin-D35To3G5.js";import"./componentData-Wy1DYnF8.js";import"./useAnalytics-DLzqrBGl.js";import"./useApp-Dqd5lgHs.js";import"./useRouteRef-Dn3cSQUO.js";import"./ArrowForward-D-952dTn.js";import"./translation-C8MSQdYC.js";import"./Page-DlPM3pt3.js";import"./useMediaQuery-COEjkueC.js";import"./Divider-BhBPAqRx.js";import"./ArrowBackIos-lH_R90MF.js";import"./ArrowForwardIos-CuwElbhc.js";import"./translation-DVahjL1f.js";import"./Modal-eVB76OKV.js";import"./Portal-CkW81tAw.js";import"./Backdrop-BkDltDI3.js";import"./styled-CAdW7jEY.js";import"./ExpandMore-BaxmueBk.js";import"./useAsync-CW2Au6KB.js";import"./useMountedState-D6eLrfLV.js";import"./AccordionDetails-BeAGU05y.js";import"./index-B9sM2jn7.js";import"./Collapse-C4uiH6iK.js";import"./ListItem-2g96ETpe.js";import"./ListContext-CwmeD3xv.js";import"./ListItemIcon-DDBrXLM0.js";import"./ListItemText-Si6zf9CU.js";import"./Tabs-DrP3lF6Y.js";import"./KeyboardArrowRight-BhWKqvGi.js";import"./FormLabel-Afp8JsJ1.js";import"./formControlState-BQU6yhH1.js";import"./InputLabel-C_JQbkAB.js";import"./Select-BLK8dCJ1.js";import"./Popover-Ct-qR0uU.js";import"./MenuItem-CPr62g3a.js";import"./Checkbox-C1hdaMhi.js";import"./SwitchBase-9XT05q8i.js";import"./Chip-iwlGDFdd.js";import"./Link-CtDLnTRC.js";import"./index-M3sqaKV4.js";import"./lodash-B6WwamON.js";import"./WebStorage-DxodPYxM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-FonloEUf.js";import"./useIsomorphicLayoutEffect-BP1NgAsv.js";import"./BUIProvider-Bui5puU7.js";import"./openLink-CHCvyqBl.js";import"./Search-DCbfUeKN.js";import"./useDebounce-CJpVF2dU.js";import"./InputAdornment-BvoSqU8H.js";import"./TextField-DVLStF2u.js";import"./useElementFilter-BXBR35x1.js";import"./EmptyState-DRvcZZb8.js";import"./Progress-BNbkxzzs.js";import"./LinearProgress-_nZ_54T8.js";import"./ResponseErrorPanel-DPjPqs_A.js";import"./ErrorPanel-DbzJVEOG.js";import"./WarningPanel-16oLvM6D.js";import"./MarkdownContent-33uXacfS.js";import"./CodeSnippet-B8fu7jLM.js";import"./CopyTextButton-DGA1dmmr.js";import"./useCopyToClipboard-B9rynQkB.js";import"./Tooltip-CpdE-o-J.js";import"./Popper-CaJ2KdJo.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},no={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{s as CustomModal,i as Default,co as __namedExportsOrder,no as default};
