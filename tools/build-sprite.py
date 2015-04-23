import os
import json
import argparse
from xml.dom.minidom import Document

from PIL import Image

class SparrowWriter(object):

    def __init__(self, maker):
        self.maker = maker
        self.document = Document()

    def gen_meta(self, document):
        maker = self.maker
        self.root = document.createElement('TextureAtlas')
        self.root.setAttribute('imagePath', maker.image_name)
        document.appendChild(self.root)

    def gen_frames(self, document):
        maker = self.maker
        frames = {}
        for frameno in xrange(maker.num_frames):
            rowno = frameno / maker.columns
            colno = frameno % maker.columns
            frame_name = '{}.{}'.format(maker.name, '%03d' % frameno)
            frame = document.createElement('SubTexture')
            frame.setAttribute('name', frame_name)
            frame.setAttribute('x', str(colno * maker.frame_width))
            frame.setAttribute('y', str(rowno * maker.frame_height))
            frame.setAttribute('width', str(maker.frame_width))
            frame.setAttribute('height', str(maker.frame_height))
            self.root.appendChild(frame)

    def export(self):
        self.gen_meta(self.document)
        self.gen_frames(self.document)
        print(self.document.toprettyxml())

class JsonSpriteWriter(object):

    def __init__(self, maker):
        self.maker = maker
        self.output = {}

    def gen_meta(self, output):
        maker = self.maker
        output['meta'] = {
            'image': maker.image_name,
            'scale': 1,
            'size': {
                'w': maker.image_width,
                'h': maker.image_height,
            }
        }

    def gen_frames(self, output):
        maker = self.maker
        frames = {}
        for frameno in xrange(maker.num_frames):
            rowno = frameno / maker.columns
            colno = frameno % maker.columns
            frame_name = '{}.{}'.format(maker.name, '%03d' % frameno)
            frame = {
                'frame': {
                    'x': colno * maker.frame_width,
                    'y': rowno * maker.frame_height,
                    'w': maker.frame_width,
                    'h': maker.frame_height,
                },
                'spriteSourceSize': {
                    'x': maker.sprite_offset_x,
                    'y': maker.sprite_offset_y,
                    'w': maker.sprite_width,
                    'h': maker.sprite_height
                },
                'sourceSize': {
                    'w': maker.sprite_width,
                    'h': maker.sprite_height
                },
                'rotated': False,
                'trimmed': True
            }
            frames[frame_name] = frame
        output['frames'] = frames

    def export(self):
        self.gen_meta(self.output)
        self.gen_frames(self.output)
        print(json.dumps(self.output, sort_keys=True, indent=4))


class SpriteMaker(object):

    WRITERS = {
        'json': JsonSpriteWriter,
        'sparrow': SparrowWriter
    }

    def __init__(self, args):
        self.export_type = args.export_type
        self.name = args.sprite_name
        self.image_path = args.image_path
        self.image_name = os.path.basename(self.image_path)
        self.image = Image.open(self.image_path)
        self.image_width, self.image_height = self.image.size
        self.num_frames = args.frames
        self.columns = args.columns
        self.rows = args.rows
        self.frame_width = args.frame_width or self._default_frame_width()
        self.frame_height = args.frame_width or self._default_frame_height()
        self.sprite_width = args.sprite_width or self.frame_width
        self.sprite_height = args.sprite_height or self.frame_height
        self.sprite_offset_x = args.sprite_offset_x
        self.sprite_offset_y = args.sprite_offset_y
        if self.export_type not in self.WRITERS:
            raise Exception('No writer for {}'.format(export_type))
        cls = self.WRITERS[self.export_type]
        self.writer = cls(self)

    def _default_frame_width(self):
        return self.image_width / self.columns

    def _default_frame_height(self):
        return self.image_height / self.rows

    def export(self):
        self.writer.export()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Create Spritesheet Description')
    parser.add_argument('--type', dest='export_type', default='sparrow',
                        help='Type of spritesheet to export')
    parser.add_argument('--name', dest='sprite_name', required=True,
                        help='ID/Name of the sprite-sheet')
    parser.add_argument('-r', '--rows', dest='rows', type=int, required=True,
                        help='Number of rows')
    parser.add_argument('-c', '--columns', dest='columns', type=int,
                        required=True, help='Number of columns')
    parser.add_argument('-n', '--frames', dest='frames', type=int,
                        required=True, help='Number of frames')
    parser.add_argument('--sprite-offset-x', dest='sprite_offset_x', default=0,
                        type=int, help='x-offset of sprite in frame')
    parser.add_argument('--sprite-offset-y', dest='sprite_offset_y', default=0,
                        type=int, help='y-offset of sprite in frame')
    parser.add_argument('--sprite-width', dest='sprite_width', type=int,
                        default=None, help='Sprite width')
    parser.add_argument('--sprite-height', dest='sprite_height', type=int,
                        default=None, help='Sprite height')
    parser.add_argument('--frame-width', dest='frame_width', type=int,
                        default=None, help='Sprite width')
    parser.add_argument('--frame-height', dest='frame_height', type=int,
                        default=None, help='Sprite height')
    parser.add_argument('image_path', help='Path to the image')
    args = parser.parse_args()
    sprite_maker = SpriteMaker(args)
    sprite_maker.export()
