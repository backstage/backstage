import{j as t,m as d,I as u,b as h,T as g}from"./iframe-BNEamOZA.js";import{r as x}from"./plugin-xKBlAPgM.js";import{S as m,u as n,a as S}from"./useSearchModal-DNGNnA-s.js";import{B as c}from"./Button-V9lH7kxA.js";import{a as f,b as M,c as j}from"./DialogTitle-w4GpYJ__.js";import{B as C}from"./Box-3EsxCCm9.js";import{S as r}from"./Grid-CRwHHoKE.js";import{S as y}from"./SearchType-DRXMEOPu.js";import{L as I}from"./List-DzzgZbq5.js";import{H as R}from"./DefaultResultListItem-Cc3OF6RQ.js";import{s as B,M as D}from"./api-C0fRxaNa.js";import{S as T}from"./SearchContext-CkHPevI1.js";import{w as k}from"./appWrappers-Cnm2FtIc.js";import{SearchBar as v}from"./SearchBar-C51X55hh.js";import{a as b}from"./SearchResult-BPffg7Ar.js";import"./preload-helper-PPVm8Dsz.js";import"./index-9tadvsc-.js";import"./Plugin-BRYNsTLg.js";import"./componentData-Ci7GQLI0.js";import"./useAnalytics-CDZunouu.js";import"./useApp-D0ZSr7F9.js";import"./useRouteRef-B_Hzl5Hs.js";import"./index-eWkqxFkm.js";import"./ArrowForward-IiBET2Zy.js";import"./translation-Dz99vQpA.js";import"./Page-PJ8MY3l8.js";import"./useMediaQuery-BOgobTs9.js";import"./Divider-DHY-OV0t.js";import"./ArrowBackIos-B9rL20ol.js";import"./ArrowForwardIos-xCNVM1cm.js";import"./translation-CB8m_OIW.js";import"./Modal-DO3msElT.js";import"./Portal-DTr3SEhf.js";import"./Backdrop-DFZc26u5.js";import"./styled-vJQyp9py.js";import"./ExpandMore-CsLuOGj_.js";import"./useAsync-DTLzs39j.js";import"./useMountedState-Dry2TiBQ.js";import"./AccordionDetails-BJMgrmW8.js";import"./index-B9sM2jn7.js";import"./Collapse-OWL0PMb0.js";import"./ListItem-ZNxVQ_73.js";import"./ListContext-XsugHlK5.js";import"./ListItemIcon-BMfY9o5p.js";import"./ListItemText-DDE6HSA_.js";import"./Tabs-JOwnbLCk.js";import"./KeyboardArrowRight-VDvlfOP5.js";import"./FormLabel-BRK_LAWk.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-buV-QlLj.js";import"./InputLabel-CH4Nqqve.js";import"./Select-B8_uejOX.js";import"./Popover-8csDASer.js";import"./MenuItem-N74_guDo.js";import"./Checkbox-CtEhA_Ry.js";import"./SwitchBase-DQXanYJ1.js";import"./Chip-Dxv8dc2v.js";import"./Link-CYOaEznZ.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-B3f76rj0.js";import"./useIsomorphicLayoutEffect-B3lwMs3P.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CddEkTCc.js";import"./useDebounce-B0JvRJ0r.js";import"./InputAdornment-Dl85-pII.js";import"./TextField-D_ydlKEl.js";import"./useElementFilter-NEBK5j3u.js";import"./EmptyState-CJrl8qu1.js";import"./Progress-BurnMpTx.js";import"./LinearProgress-BFo1-q8p.js";import"./ResponseErrorPanel-BW09Bggl.js";import"./ErrorPanel-DFxFI8yn.js";import"./WarningPanel-DQQjxQBT.js";import"./MarkdownContent-DXsGFVRJ.js";import"./CodeSnippet-C1V19_EM.js";import"./CopyTextButton-D-HwPeLy.js";import"./useCopyToClipboard-B1J-P2VS.js";import"./Tooltip-Bujs_RiC.js";import"./Popper-DSZDidno.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
