import { Component } from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import { Types } from '../../config'
import { Context, ContextType } from '../RCMap'

interface RequiredProps {
  url: string
}

type Props = Readonly<RequiredProps & L.TileLayerOptions>

export default class TileLayer extends Component<Props> {
  protected static propTypes = {
    ...Types.TileLayerOptionsShape,
    url: PropTypes.string.isRequired
  }

  public static contextType = Context

  public context: ContextType

  private instance: L.TileLayer

  protected constructor (props: Props, context: ContextType) {
    super(props)
    const { url, ...options } = props

    this.instance = L.tileLayer(url, options)
    if (context.map) {
      context.map.addLayer(this.instance)
    }
  }

  public shouldComponentUpdate (nextProps: Props): boolean {
    const { url, zIndex, opacity } = this.props
    const { url: nextUrl, zIndex: nextZIndex, opacity: nextOpacity } = nextProps

    return !(url === nextUrl && zIndex === nextZIndex && opacity === nextOpacity)
  }

  public componentDidUpdate (prevProps: Props): void {
    const { url: prevUrl, zIndex: prevZIndex, opacity: prevOpacity } = prevProps
    const { url, zIndex, opacity } = this.props
    const tileLayer = this.instance

    if (url !== prevUrl) {
      tileLayer.setUrl(url)
    }
    if (zIndex !== prevZIndex) {
      tileLayer.setZIndex(zIndex)
    }
    if (opacity !== prevOpacity) {
      tileLayer.setOpacity(opacity)
    }
  }

  public componentWillUnmount (): void {
    this.instance.remove()
  }

  public render (): null {
    return null
  }
}