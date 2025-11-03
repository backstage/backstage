import{j as t,m as d,I as u,b as h,T as g}from"./iframe-B1bS8kNu.js";import{r as x}from"./plugin-Tb-NEX9-.js";import{S as m,u as n,a as S}from"./useSearchModal-CUCpOaGG.js";import{B as c}from"./Button-CgBkAUiP.js";import{a as f,b as M,c as j}from"./DialogTitle-CGSxheNa.js";import{B as C}from"./Box-kUekMc6O.js";import{S as r}from"./Grid-C88sFnNl.js";import{S as y}from"./SearchType-ORQ9sjRj.js";import{L as I}from"./List-vAsLcuDY.js";import{H as R}from"./DefaultResultListItem-Dlu6c7Jz.js";import{s as B,M as D}from"./api-DdRYAeGK.js";import{S as T}from"./SearchContext-D0H6WQX1.js";import{w as k}from"./appWrappers-C65DRcJR.js";import{SearchBar as v}from"./SearchBar-DPpG5zaG.js";import{a as b}from"./SearchResult-CBpZEGsg.js";import"./preload-helper-D9Z9MdNV.js";import"./index-B6_CRFg0.js";import"./Plugin-D0zUNDSW.js";import"./componentData-C-kspxhs.js";import"./useAnalytics-CWJQ4paP.js";import"./useApp-DrlXjDDm.js";import"./useRouteRef-DHlcXK6F.js";import"./index-BB5XVHud.js";import"./ArrowForward-CvuqPmlL.js";import"./translation-C_xCqZ2o.js";import"./Page-0yY53fia.js";import"./useMediaQuery-CxBmQg7K.js";import"./Divider-Bq5dRhO-.js";import"./ArrowBackIos-ddsdkFD3.js";import"./ArrowForwardIos-gcK-ut0p.js";import"./translation-DzP6mnwF.js";import"./Modal-DljuX6iF.js";import"./Portal-CbatMowK.js";import"./Backdrop-DC3_0QFG.js";import"./styled-CICePBTu.js";import"./ExpandMore-Y-_AusZ_.js";import"./useAsync-DRwN7CqQ.js";import"./useMountedState-DehZQ_NE.js";import"./AccordionDetails-DjOY9uzz.js";import"./index-DnL3XN75.js";import"./Collapse-BL8sH0TP.js";import"./ListItem-F3f87gTr.js";import"./ListContext-Dr49CUeJ.js";import"./ListItemIcon-DHaOHLlT.js";import"./ListItemText-CcMD6A8n.js";import"./Tabs-Yp5MfbXb.js";import"./KeyboardArrowRight-VduaY-uT.js";import"./FormLabel-DtaAPJK1.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DaalzCaB.js";import"./InputLabel-CzH8LmN7.js";import"./Select-CVfkA-9d.js";import"./Popover-cbtVu3bF.js";import"./MenuItem-DG-GRKY3.js";import"./Checkbox-DqwWLYjE.js";import"./SwitchBase-HY5Riu8I.js";import"./Chip-UoVfto1H.js";import"./Link--XlSoX1z.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-BdE9m8Kk.js";import"./useIsomorphicLayoutEffect-B8jAT4vp.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-DqAH7vvg.js";import"./useDebounce-sNj2Y0x-.js";import"./InputAdornment-CxBprRVs.js";import"./TextField-BjbgRBOe.js";import"./useElementFilter-CEj6SlLl.js";import"./EmptyState-SYwpWYkO.js";import"./Progress-BDGc4XZz.js";import"./LinearProgress-DfXpNOeO.js";import"./ResponseErrorPanel-B2VHbAZG.js";import"./ErrorPanel-DfQRlabN.js";import"./WarningPanel-Cb2ULWmf.js";import"./MarkdownContent-B5j69JDg.js";import"./CodeSnippet-Cfe8KNVU.js";import"./CopyTextButton-amdB5IIQ.js";import"./useCopyToClipboard-DtkwdRTx.js";import"./Tooltip-CpvnZrMV.js";import"./Popper-DI0r4x2S.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
